/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/queries/users');
const DataHelpers = require('./attempt'); // Added path to DataHelpers module

// Separated Routes
const quizRoutes = require('./users_quiz')(DataHelpers);
const attemptRoutes = require('./attempt')(DataHelpers);
const loginRoutes = require('./login')(DataHelpers);

module.exports = function(DataHelpers) {
  // Home page
  router.get('/', (req, res) => {
    const userId = req.session.userId;

    getUserById(userId).then((user) => {
      const templateVars = { userName: !user ? '' : user.name };
      res.render('index', templateVars);
    });
  });

  return router;
};
