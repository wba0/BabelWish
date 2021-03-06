const express = require('express');

const JobModel = require('../models/job-model');
const UserModel = require('../models/user-model');
const BeneficiaryModel = require('../models/beneficiary-model');

const router = express.Router();

//get all jobs
router.get("/jobs", (req, res, next) => {
  JobModel.find()
    .sort({
      _id: -1
    })
    .populate("beneficiaryId")
    .populate("owner")
    .populate("worker")
    .populate("applicants")
    .exec((err, allJobs) => {
      if (err) {
        console.log("Error finding jobs", err);
        res.status(500).json({
          errorMessage: "Finding jobs went wrong"
        });
        return;
      }
      res.status(200).json(allJobs);
    });
});

//get relevant jobs (logged in user is owner or worker)
router.get("/jobs/relevantjobs", (req, res, next) => {
  JobModel.find({
      $or: [{
        owner: req.user._id
      }, {
        worker: req.user._id
      }]
    })
    .populate("beneficiaryId")
    .populate("owner")
    .populate("worker")
    .populate("applicants")
    .exec((err, foundJobs) => {
      if (err) {
        console.log("Error finding relevant jobs", err);
        res.status(500).json({
          errorMessage: "Finding relevant jobs went wrong"
        });
        return;
      }
      res.status(200).json(foundJobs);
    });
});

// post job
router.post("/jobs", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      errorMessage: "Not logged in"
    });
    return;
  }
  const theJob = new JobModel({
    owner: req.user._id,
    sourceLanguage: req.body.sourceLanguage,
    targetLanguage: req.body.targetLanguage,
    wordCount: req.body.wordCount,
    price: req.body.price,
    content: req.body.content
  });

  theJob.save((err) => {
    if (theJob.errors) {
      res.status(400).json({
        errorMessage: "Validation failed",
        validationErrors: theJob.errors
      });
      return;
    }
    if (err) {
      console.log("Error posting job: ", err);
      res.status(500).json({
        errorMessage: "Problem posting new job"
      });
      return;
    }
    res.status(200).json(theJob);
  });
});
//1: apply to job
router.post("/jobs/apply/:jobId/", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      errorMessage: "Not logged in"
    });
    return;
  }

  JobModel.findById(req.params.jobId)
    .populate("owner")
    .populate("applicants")
    .exec(
      (err, jobFromDb) => {
        //cant apply to your own jobs
        if (req.user._id.toString() === jobFromDb.owner._id.toString()) {
          console.log("You cannot apply to your own jobs")
          res.status(403).json({
            errorMessage: "You cannot apply to your own jobs"
          });
          return;
        }
        if (err) {
          console.log("Job application error ", err);
          res.status(500).json({
            errorMessage: "Job application went wrong"
          });
          return;
        }
        jobFromDb.applicants.push(req.user._id);
        jobFromDb.save((err) => {
          if (jobFromDb.errors) {
            res.status(400).json({
              errorMessage: "Application validation failed",
              validationErrors: jobFromDb.errors
            });
            return;
          }
          if (err) {
            console.log("Job application error: ", err);
            res.status(500).json({
              errorMessage: "Job application went wrong"
            });
            return;
          }
          res.status(200).json(jobFromDb);
        });
      }
    );
});

//2&3: accept/reject application
router.patch("/jobs/:jobId/:applicantId/:decision", (req, res, next) => {
  JobModel.findById(
    req.params.jobId,
    (err, jobFromDb) => {
      if (err) {
        console.log("Job patch error: ", err);
        res.status(500).json({
          errorMessage: "Job update went wrong."
        });
        return;
      }
      if (req.params.decision === "accept") {
        jobFromDb.set({
          applicants: [],
          undergoingWork: true,
          worker: req.params.applicantId
        });
      }
      if (req.params.decision === "reject") {
        const indexOfReject = jobFromDb.applicants.indexOf(req.params.applicantId);
        if (indexOfReject > -1) {
          jobFromDb.applicants.splice(indexOfReject, 1);
        };
        jobFromDb.set({
          //necessary?
          undergoingWork: false
        });
      }
      jobFromDb.save((err) => {
        if (jobFromDb.errors) {
          res.status(400).json({
            errorMessage: "Accept/reject applicant failed",
            validationErrors: jobFromDb.errors
          });
          return;
        }
        if (err) {
          console.log("Job update error: ", err);
          res.status(500).json({
            errorMessage: "Job update went wrong"
          });
          return;
        }
        res.status(200).json(jobFromDb);
      });
    }
  )
});

//4: Job submitted
router.patch("/submitJob/:jobId", (req, res, next) => {
  JobModel.findById(
    req.params.jobId,
    (err, jobFromDb) => {
      if (err) {
        console.log("Job patch error: ", err);
        res.status(500).json({
          errorMessage: "Job submission went wrong."
        });
        return;
      }
      console.log(req.body);
      console.log(req.body.translatedContent);
      console.log(req.body.beneficiaryId);
      jobFromDb.set({
        undergoingWork: false,
        finishedNotPaid: true,
        translatedContent: req.body.translatedContent,
        beneficiaryId: req.body.beneficiaryId
      });

      jobFromDb.save((err) => {
        if (jobFromDb.errors) {
          res.status(400).json({
            errorMessage: "Save submit job failed",
            validationErrors: jobFromDb.errors
          });
          return;
        }
        if (err) {
          console.log("Job update error: ", err);
          res.status(500).json({
            errorMessage: "Job submission went wrong"
          });
          return;
        }
        res.status(200).json(jobFromDb);
      });
    }
  )
});
//5&6: Job approved/rejected
router.patch("/submittedJob/:jobId/:decision/:workerId/:rating", (req, res, next) => {
	let responseArr = [];
  if (req.params.decision === "accept") {
    setFinishedNotPaid = false;
    setFinishedAndPaid = true;
		UserModel.findByIdAndUpdate(
			req.params.workerId, {
			$push: {
				rating: req.params.rating
			}
			},
			(err, userFromDb) => {
				if (err) {
					console.log("User rating error: ", err);
					res.status(500).json({
						errorMessage: "User rating went wrong"
					});
					return;
				}
				responseArr.push(userFromDb);
		}
		);
  }
  if (req.params.decision === "reject") {
    setUndergoingWork = true;
    setFinishedNotPaid = false;
  }

  JobModel.findByIdAndUpdate(
    req.params.jobId, {
      $set: {
        finishedNotPaid: setFinishedNotPaid,
        finishedAndPaid: setFinishedAndPaid
      }
    },
    (err, jobFromDb) => {
			console.log("found job from db: ", jobFromDb)
      if (err) {
        console.log("Translation approval/rejection error: ", err);
        res.status(500).json({
          errorMessage: "Translation approval/rejection went wrong."
        });
        return;
      }
			responseArr.push(jobFromDb);

			res.status(200).json(responseArr);
	}
	);

});


//7:pay and complete job
router.patch("/payandcompletejob/:jobId", (req, res, next) => {
  JobModel.findById(
    req.params.jobId,
    (err, jobFromDb) => {
      if (err) {
        console.log("Job pay/complete error: ", err);
        res.status(500).json({
          errorMessage: "Job pay/complete went wrong."
        });
        return;
      }
      jobFromDb.set({
        finishedNotPaid: false,
        finishedAndPaid: true
      });

      jobFromDb.save((err) => {
        if (jobFromDb.errors) {
          res.status(400).json({
            errorMessage: "Save pay/complete job failed",
            validationErrors: jobFromDb.errors
          });
          return;
        }
        if (err) {
          console.log("Job update error: ", err);
          res.status(500).json({
            errorMessage: "Job pay/complete save went wrong"
          });
          return;
        }
        res.status(200).json(jobFromDb);
      });
    }
  )
});



//get single job
router.get("/jobs/:jobId", (req, res, next) => {
  JobModel.findById(req.params.jobId)
    .populate("owner")
    .populate("worker")
    .exec(
      (err, jobFromDb) => {
        if (err) {
          console.log("Job details error ", err);
          res.status(500).json({
            errorMessage: "Job details went wrong"
          });
          return;
        }
        res.status(200).json(jobFromDb);
      }
    );
});

//delete single job
router.delete("/jobs/:jobId", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      errorMessage: "Please log in."
    });
    return;
  }
  JobModel.findById(
    req.params.jobId,
    (err, jobFromDb) => {
      if (err) {
        console.log("Job owner cannot be confirmed. ", err)
        res.status(500).json({
          errorMessage: "Job owner went wrong."
        });
        return;
      }
      if (jobFromDb.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({
          errorMessage: "This job does not belong to you"
        });
        return;
      }
      JobModel.findByIdAndRemove(
        req.params.jobId,
        (err, jobFromDb) => {
          if (err) {
            console.log("Job delete error ", err);
            res.status(500).json({
              errorMessage: "Job delete went wrong"
            });
            return;
          }
          res.status(200).json(jobFromDb);
        }
      );
    }
  );
});




module.exports = router
