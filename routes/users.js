/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// users.js

const express = require('express');
const router = express.Router();
const { getUserById, getQuizzes } = require('../db/queries/users');
const DataHelpers = require('./attempt');

// Separated Routes
const quizRoutes = require('./routes/users_quiz')(DataHelpers);
const attemptRoutes = require('./routes/attempt')(DataHelpers);
const loginRoutes = require('./routes/login')(DataHelpers);

router.get('/', (req, res) => {
  const userId = req.session.userId;

  Promise.all([getUserById(userId), getQuizzes()])
    .then(([user, quizzes]) => {
      const templateVars = {
        userName: !user ? '' : user.name,
        quizzes,
      };
      res.render('quiz', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // error handling
      res.status(500).send('Internal Server Error');
    });
});

// Fetch list of available quizzes
router.get('/quizzes', (req, res) => {
  DataHelpers.getQuizzes()
    .then((quizzes) => {
      const templateVars = {
        quizzes,
      };
      res.render('index', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // error handling
      res.status(500).send('Internal Server Error');
    });
});

router.get('/quiz/:quizId', (req, res) => {
  const quizId = req.params.quizId;
  DataHelpers.getQuizDetails(quizId)
    .then((quizzes) => {
      const templateVars = {
        userName: req.session.userName,
        quizzes: quizzes,
      };
      res.render('quiz', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // Handle errors here
      res.status(500).send('Internal Server Error');
    });
});

router.get('/quiz/:quizId/results', (req, res) => {
  const quizId = req.params.quizId;
  DataHelpers.getQuizDetails(quizId)
    .then((quizzes) => {
      const templateVars = {
        userName: req.session.userName,
        quizzes: quizzes,
      };
      res.render('results', templateVars); // Render the results.ejs template
    })
    .catch((error) => {
      console.error(error);
      // Handle errors here
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
