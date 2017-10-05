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
			console.log("Error posting job: ", err);
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
				console.log("Phone details error: ", err);
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
					});
					return;
				}
				if(err){
					console.log("Phone update error: ", err);
					res.status(500).json({errorMessage: "Job update went wrong"});
					return;
				}
				res.status(200).json(jobFromDb);
			});
		}
	)
});

router.delete("/jobs/:jobId", (req, res, next) => {
	if(!req.user){
		res.status(401).json({errorMessage: "Please log in."});
		return;
	}
	JobModel.findById(
		req.params.jobId,
		(err, jobFromDb) => {
			if(err){
				console.log("Job owner cannot be confirmed. ", err)
				res.status(500).json({errorMessage: "Job owner went wrong."});
				return;
			}
			if(jobFromDb.owner.toString() !== req.user._id.toString()){
				res.status(403).json({errorMessage: "This job does not belong to you"});
				return;
			}
			JobModel.findByIdAndRemove(
				req.params.jobId,
				(err, jobFromDb) => {
					if(err){
						console.log("Job delete error ", err);
						res.status(500).json({errorMessage: "Job delete went wrong"});
						return;
					}
					res.status(200).json(jobFromDb);
				}
			);
		}
	);
});

router.get("/myjobs", (req, res, next) => {
	if(!req.user){
		res.status(401).json({errorMessage: "You are not logged in"});
		return;
	}
	JobModel.find(
		{owner: req.user._id},
		(err, foundJobs) => {
			if(err){
				res.status(500).json({errorMessage: "My jobs went wrong"});
				return;
			}
			res.status(200).json(foundJobs);
		});
});

module.exports = router
