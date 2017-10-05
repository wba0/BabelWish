const mongoose = require('mongoose');
const LanguageModel = require('../models/language-model.js');

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const languageArray = [
	{
    language: "english",
    langDisplay: "English",
    isoCode: "us"
  },
	{
    language: "french",
    langDisplay: "Français",
    isoCode: "fr"
  },
	{
    language: "spanish",
    langDisplay: "Español",
    isoCode: "es"
  },
	{
    language: "japanese",
    langDisplay: "日本語",
    isoCode: "jp"
  },
	{
    language: "chinese",
    langDisplay: "中文",
    isoCode: "cn"
  },

];




LanguageModel.create(
  languageArray,
  (err, languagesAfterSave) => {
    if (err) {
      console.log("create seed error", err);
      return;
    }
    languagesAfterSave.forEach((lang) => {
      console.log("Language ---> ", lang.language);
    });
  }
);
