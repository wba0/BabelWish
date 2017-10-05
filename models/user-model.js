const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username:{
			type: String,
			required: [true, "Username required."]
		},
		password:{
			type: String,
			required: [true, "Password required."]
		},
		avatarUrl:{
			type: String,
			required: false,
			default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIoWE9ZmLDWEvA2R1St18oRyGK-d7OM9UAP9W0qiBtDOAW_rbB2A"
		},
		rating:{
			type: Number,
			default: 0,
			min: 0,
			max: 5,
			required: false
		},
		certifications:{
			type: Array,
			default: [],
			required: false
		},
		motherTongues:{
			type: Array,
			default: [],
			required: false
		},
		postedJobs:{
			type: Array,
			default: []
		},
		finishedJobs:{
			type: Array,
			default: []
		},
		inProgressJobs:{
			type: Array,
			default: []
		},
		submittedJobs:{
			type: Array,
			default: []
		}
	},
	{
		timestamps: true
	}
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
