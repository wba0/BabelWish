const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const cors 				 = require('cors');
const passport 		 = require('passport');
const session 		 = require('express-session');

require("dotenv").config();
require("./config/passport-config");

mongoose.connect(process.env.MONGODB_URI);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:4200"]
	})
);
app.use(
	session({
		secret: "meow meow woof woof",
		resave: true,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	if(req.user){
		res.locals.user = req.user;
	} else {
		res.locals.user = null;
	}
	next();
});

// routes start
const myAuthRoutes = require("./routes/auth-api-router");
app.use("/api", myAuthRoutes);
const myJobRoutes = require('./routes/job-router');
app.use("/api", myJobRoutes);
const myBenefRoutes = require('./routes/beneficiary-router');
app.use("/api", myBenefRoutes);
const myUserRoutes = require('./routes/user-router');
app.use("/api", myUserRoutes);
const myPayPayRoutes = require('./routes/paypal-router');
app.use("/api", myPayPayRoutes);
// routes end

//this is for deployment only


app.use((req, res, next)=>{
	res.sendFile(__dirname + "/public/index.html");
});




// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
