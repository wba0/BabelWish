const express = require('express');
const BeneficiaryModel = require('../models/beneficiary-model');

const router = express.Router();

//get all beneficiaries
router.get("/beneficiaries", (req, res, next) => {
  BeneficiaryModel.find()
    .sort({
      _id: -1
    })
    .exec((err, allBeneficiaries) => {
      if (err) {
        console.log("Error finding beneficiaries", err);
        res.status(500).json({
          errorMessage: "Finding beneficiaries went wrong"
        });
        return;
      }
      res.status(200).json(allBeneficiaries);
    });
});


//get single job
router.get("/beneficiaries/:benefId", (req, res, next) => {
  BeneficiaryModel.findById(
    req.params.benefId,
    (err, benefFromDb) => {
      if (err) {
        console.log("Beneficiary details error ", err);
        res.status(500).json({
          errorMessage: "Beneficiary details went wrong"
        });
        return;
      }
      res.status(200).json(benefFromDb);
    }
  );
});


module.exports = router
