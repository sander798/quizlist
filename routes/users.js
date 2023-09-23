/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/queries/users');
const DataHelpers = require('./attempt');

// Separated Routes
const quizRoutes = require('./users_quiz')(DataHelpers);
const attemptRoutes = require('./attempt')(DataHelpers);
const loginRoutes = require('./login')(DataHelpers);

module.exports = function (DataHelpers) {
  // Home page
  router.get('/', (req, res) => {
    const userId = req.session.userId;
    const templateVars = {};

    Promise.all([getUserById(userId), getQuizzes()
      .then(([user, quizzes]) => {
        const templateVars = {
          userName: !user ? '' : user.name,
          quizzes,
        };
        res.render('quiz', templateVars);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
        res.status(500).send('Internal Server Error');
      })
  });
  return router;
};
