const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		owner:{
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		sourceLanguage:{
			type: String,
			required: true
		},
		targetLanguage{
			type: String,
			required: true
		},
		beneficiary{
			type: String,
			required: true
		},
		wordCount{
			type: Number,
			required: true
		}
		price{
			type: Number,
			required: true
		},
		content{
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const JobModel = mongoose.model("Job", userSchema);

module.exports = JobModel;
