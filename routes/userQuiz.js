const express = require('express');
const router = express.Router();
const { getUserById, getQuizResult, getQuizDetails, getQuiz } = require('../db/queries/users'); // Updated imports

module.exports = function(DataHelpers) {
  // Create new quiz page
  router.get('/new', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/quizapp/login');
    }

    getUserById(userId).then((user) => {
      const templateVars = { userName: user.name };
      res.render('quiz_form', templateVars);
    });
  });

  // Page for results of all quizzes taken
  router.get('/results/:url', (req, res) => {
    const userId = req.session.userId;
    const templateVars = {};
    const url = req.params.url;

    templateVars.url = url;

    Promise.all([getUserById(userId), getQuizResult(url, userId)]) // Updated function name
      .then(([user, results]) => {
        templateVars.userName = !user ? '' : user.name;
        templateVars.results = results;
        return results[0].quiz_id;
      })
      .then((quizId) => getQuizDetails(quizId))
      .then((quiz) => {
        templateVars.quiz = quiz;
        res.render('quiz_stats', templateVars);
      });
  });

  // Page to take a quiz
  router.get('/:url', (req, res) => {
    const userId = req.session.userId;

    Promise.all([getUserById(userId), getQuiz({ url: req.params.url })])
      .then(([user, quiz]) => {
        const templateVars = {
          userName: !user ? '' : user.name,
          quiz,
        };
        res.render('quiz', templateVars);
      });
  });

  return router;
};
