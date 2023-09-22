// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const { getUserById, getQuizResult, getQuizDetails, getQuiz } = require('./db/queries/users'); // Import necessary queries

const PORT = process.env.PORT || 8080;
const app = express();

const DataHelpers = require('./attempt');

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users')(DataHelpers); // Call with DataHelpers parameter

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const userId = req.session.userId;

  getUserById(userId)
    .then((user) => {
      const templateVars = { userName: !user ? '' : user.name };
      res.render('index', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // Handle errors here, like sending an error response
      res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

