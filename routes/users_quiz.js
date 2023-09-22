const express = require('express');
const router = express.Router();

// New quiz creation page
router.get('/new', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect('/quizapp/login');
  }

  // Retrieve user information by user ID
  getUserById(userId).then((user) => {
    const templateVars = { userName: user.name };
    res.render('quiz_form', templateVars);
  });
});
