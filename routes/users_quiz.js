const express = require('express');
const router = express.Router();

module.exports = function (DataHelpers) {
  // New quiz creation page
  router.get('/new', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/quizapp/login');
    }

    // Use the getUserById function from DataHelpers
    DataHelpers.getUserById(userId).then((user) => {
      const templateVars = { userName: user.name };
      res.render('quiz_form', templateVars);
    });
  });

  return router;
};
