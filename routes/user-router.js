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

router.delete("/users/removeLanguageSkill/:language", (req, res, next) => {

			const deleteMatch = req.params.language.toLowerCase();

			req.user.update(
				{ $pull: { languageSkills: { language: deleteMatch } } },
				(err) => {
        if (err) {
          res.status(500).json({
            errorMessage: "Delete language skill validation failed" });
          return;
        }
				res.status(200).json(req.user);
      });
});



module.exports = router
