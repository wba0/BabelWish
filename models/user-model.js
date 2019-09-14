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
		rating:[{
			type: Number,
			min: 0,
			max: 5
		}],
		certifications:[{
			name: String,
			year: String
		}],
		languageSkills:[{
			language: String,
			proficiency: String
		}],
		jobs:[{
	    type: Schema.Types.ObjectId,
	    ref: "Job"
	  }]
	},
	{
		timestamps: true,
		usePushEach: true
	}
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
