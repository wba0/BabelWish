const express = require('express');

const JobModel = require('../models/job-model');
const BeneficiaryModel = require('../models/beneficiary-model');

const router = express.Router();

router.get("/users/:userId", (req, res, next) => {
  UserModel.findById(
    req.params.userId,
    (err, userFromDb) => {
      if (err) {
        console.log("User details error ", err);
        res.status(500).json({
          errorMessage: "User details went wrong"
        });
        return;
      }
      res.status(200).json(userFromDb);
    }
  );
});


module.exports = router
