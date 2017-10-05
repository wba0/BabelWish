const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		owner:{
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		worker:{
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false
		},
		sourceLanguage:{
			type: String,
			required: true
		},
		targetLanguage:{
			type: String,
			required: true
		},
		beneficiaryName:{
			type: String,
			required: false
		},
		beneficiaryId:{
			type: Schema.Types.ObjectId,
			ref: "Beneficiary"
		},
		wordCount:{
			type: Number,
			required: false
		},
		price:{
			type: Number,
			required: false
		},
		content:{
			type: String,
			required: true
		},
		undergoingWork:{
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

const JobModel = mongoose.model("Job", jobSchema);

module.exports = JobModel;
