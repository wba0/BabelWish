const express = require('express');

const JobModel = require('../models/job-model');

const router = express.Router();

router.get("/jobs", (req, res, next) => {
	JobModel.find()
	.sort({_id: -1})
	.exec((err, allJobs) => {
		if(err){
			console.log("Error finding jobs", err);
			res.status(500).json({errorMessage: "Finding jobs went wrong"});
			return;
		}
		res.status(200).json(allJobs);
	});
});

router.post("/jobs", (req, res, next) => {
	if(!req.user){
		res.status(401).json({errorMessage: "Not logged in"});
		return;
	}
	const theJob = new JobModel({
		owner: req.user._id,
		sourceLanguage: req.body.sourceLanguage,
		targetLanguage: req.body.targetLanguage,
		beneficiary: req.body.beneficiary,
		wordCount: req.body.wordCount,
		price: req.body.wordCount,
		content: req.body.content
	});

	theJob.save((err) => {
		if(theJob.errors){
			res.status(400).json({
				errorMessage: "Validation failed",
				validationErrors: theJob.errors
			});
			return;
		}
		if(err){
			console.log("Error posting job, " err);
			res.status(500).json({errorMessage: "Problem posting new job"});
			return;
		}
		res.status(200).json(theJob);
	});
});

router.get("/jobs/:jobId", (req, res, next) => {
	JobModel.findById(
		req.params.jobId,
		(err, jobFromDb) => {
			if(err){
				console.log("Job details error ", err);
				res.status(500).json({errorMessage: "Job details went wrong"});
				return;
			}
			res.status(200).json(jobFromDb);
		}
	);
});

router.put("/jobs/:jobId", (req, res, next) => {
	JobModel.findById(
		req.params.jobId,
		(err, jobFromDb) => {
			if(err){
				console.log("Phone details error, " err);
				res.status(500).json({errorMesage: "Job details went wrong"});
				return;
			}
			jobFromDb.set({
				owner: req.user._id,
				sourceLanguage: req.body.sourceLanguage,
				targetLanguage: req.body.targetLanguage,
				beneficiary: req.body.beneficiary,
				wordCount: req.body.wordCount,
				price: req.body.wordCount,
				content: req.body.content
			});
			jobFromDb.save((err) => {
				if(jobFromDb.errors){
					res.status(400).json({
						errorMessage: "Update validation failed",
						validationErrors: jobFromDb.errors
					})
				}
			});
		}
	)
});

module.exports = router
