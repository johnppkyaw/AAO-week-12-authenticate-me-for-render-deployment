const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

//Validation error from sequelize
const {ValidationError} = require('sequelize');

//check whether in production environment or not
const { environment } = require('./config');
const isProduction = environment === 'production';

//initialize express application
const app = express();

//connect morgan middleware that logs req and res
app.use(morgan('dev'));

//add cookie-parser middleware
app.use(cookieParser());

//add express.json middleware - parses JSON req bodies with Content-Type of "application/json"
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
//make sure requests are not forged
app.use(
  csurf({
    cookie: {
      name: 'XSRF-TOKEN',
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

//import routes
const routes = require('./routes');
app.use(routes);

//middleware to handle cases where a requested resource couldn't be found, and it generates a 404 error.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
})

//middleware to catch Sequelize errors and format them before sending the error response.
app.use((err, _req, _res, next) => {
  if(err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
})

//middleware to format all errors before returning JSON response
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
