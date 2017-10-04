const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/user-model');

passport.serializeUser((userFromDb, done) => {
	done(null, userFromDb._id);
});

passport.deserializeUser((idFromSession, done) => {
	UserModel.findById(
		idFromSession,
		(err, userFromDb) => {
			if(err){
				done(err);
				return;
			}
			done(null, userFromDb);
		}
	);
});

passport.use(
	new LocalStrategy(
		{
			usernameField: 'loginUsername',
			passwordField: 'loginPassword'
		},
		(sentUsername, sentPassword, done) => {
			UserModel.findOne(
				{ username: sentUsername },
				(err, userFromDb) => {
					if(err){
						done(err);
						return;
					}
					if(!userFromDb){
						done(null, false, { message: "Wrong Username" });
						return;
					}
					const isPasswordGood =
					bcryptjs.compareSync(sentPassword, userFromDb.password);
					if(!isPasswordGood){
						done(null, false, { message: "Wrong Password" });
						return;
					}
					done(null, userFromDb);
				}
			);
		}
	)
);
