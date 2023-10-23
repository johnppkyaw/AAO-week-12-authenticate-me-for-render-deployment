const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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





module.exports = app;