const express = require('express');
const router = express.Router();

module.exports = function (DataHelpers) {
  // Single attempt page
  router.get('/:url', (req, res) => {
    const userId = req.session.userId;
    const url = req.params.url;
    const templateVars = {};

    Promise.all([
      DataHelpers.getUserById(userId),
      DataHelpers.getQuizResult(url, userId),
    ])
      .then(([user, attempt]) => {
        templateVars.attempt = attempt;
        templateVars.userName = !user ? '' : user.name;
        return attempt[0].quiz_id;
      })
      .then((quizId) => DataHelpers.getQuizDetails(quizId))
      .then((quiz) => {
        templateVars.quiz = quiz;
        res.render('quiz_attempt', templateVars);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here, like sending an error response
        res.status(500).send('Internal Server Error');
      });
  });

  return router;
};
