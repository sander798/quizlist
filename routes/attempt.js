const express = require('express');
const router = express.Router();

module.exports = function(DataHelpers) {
  // Single attempt page
  router.get('/:url', (req, res) => {
    const userId = req.session.userId;
    const url = req.params.url;

    Promise.all([
      DataHelpers.getUserById(userId),
      DataHelpers.getQuizResult(url, userId), // Updated function name
    ])
      .then(([user, attempt]) => {
        const templateVars = {
          attempt,
          userName: !user ? '' : user.name,
        };
        return attempt[0].quiz_id;
      })
      .then((quizId) => DataHelpers.getQuizDetails(quizId))
      .then((quiz) => {
        templateVars.quiz = quiz;
        res.render('quiz_attempt', templateVars);
      })
      .catch((error) => console.log(error));
  });

  return router;
};
