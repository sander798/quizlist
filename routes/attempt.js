const express = require('express');
const router = express.Router();
const db = require('../db/queries/users');

module.exports = function (DataHelpers) {
  // Single attempt page
  router.get('/:url', (req, res) => {
    const userId = 0;
    const url = req.params.url;
    const templateVars = {};

    Promise.all([
      db.getUserById(userId),
      db.getQuizResult(url, userId),
    ])
      .then(([user, attempt]) => {
        templateVars.attempt = attempt;
        templateVars.userName = !user ? 'John Doe' : user.name;
        return attempt[0].quiz_id;
      })
      .then((quizId) => db.getQuizDetails(quizId))
      .then((quiz) => {
        templateVars.quiz = quiz;
        res.render('results', templateVars);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here, like sending an error response
        res.status(500).send('Internal Server Error');
      });
  });

  return router;
};
