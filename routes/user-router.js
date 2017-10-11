const express = require('express');
const UserModel = require('../models/user-model');

const router = express.Router();

router.get("/users/:userId", (req, res, next) => {
  UserModel.findById(req.params.userId)
		.populate("jobs")
		.exec(
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
