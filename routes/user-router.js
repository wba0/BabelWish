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

router.patch("/users/addLanguageSkill", (req, res, next) => {
console.log("req user langaiugeskills", req.user.languageSkills);
  req.user.languageSkills.push({
      language: req.body.language,
      proficiency: req.body.proficiency
      });
  req.user.save((err) => {
    if (req.user.errors) {
      res.status(400).json({
        errorMessage: "Update language skill validation failed",
        validationErrors: req.user.errors
      });
      return;
    }
  });
  res.status(200).json(req.user.languageSkills);
});

router.delete("/users/:userId/removeLanguageSkill", (req, res, next) => {
  UserModel.findById(
    req.params.userId,
    (err, userFromDb) => {
      if (err) {
        console.log("Delete language skill error: ", err);
        res.status(500).json({
          errorMessage: "Delete language skill went wrong"
        });
        return;
      }
      //delete it


      userFromDb.save((err) => {
        if (userFromDb.errors) {
          res.status(400).json({
            errorMessage: "Delete language skill validation failed",
            validationErrors: userFromDb.errors
          });
          return;
        }
      });
      res.status(200).json(userFromDb);
    }
  );
});



module.exports = router
