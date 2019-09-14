const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const beneficiarySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
  },
  website: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  yearFounded: {
    type: String
  },
  mission: {
    type: String
  },
  logoUrl: {
    type: String,
    required: true
  },
  photoUrlArr: [{
    type: String
  }],
	payPalAddress: {
		type: String,
		required: true
	}


}, {
  timestamps: true,
  usePushEach: true
});

const BeneficiaryModel = mongoose.model("Beneficiary", beneficiarySchema);

module.exports = BeneficiaryModel;
