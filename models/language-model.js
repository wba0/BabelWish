const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const langSchema = new Schema(
	{
		language: {
			type: String
		},
		langDisplay: {
			type: String
		},
		isoCode: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

const LanguageModel = mongoose.model("Language", langSchema);

module.exports = LanguageModel;
