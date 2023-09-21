const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/queries/users');
const { getQuizResult, getQuizDetails, getQuiz } = require('../db/queries/users'); // Updated imports

// Single attempt page
router.get('/:url', (req, res) => {
  const userId = req.session.userId;
  const url = req.params.url;

  Promise.all([
    getUserById(userId),
    getQuizResult(url, userId), // Updated function name
  ])
    .then(([user, attempt]) => {
      const templateVars = {
        attempt,
        userName: !user ? '' : user.name,
      };
      return attempt[0].quiz_id; // You might need to adjust this based on your data structure
    })
    .then((quizId) => getQuizDetails(quizId)) // Use getQuizDetails
    .then((quiz) => {
      templateVars.quiz = quiz;
      res.render('quiz_attempt', templateVars);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
