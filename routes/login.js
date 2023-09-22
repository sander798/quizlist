const express = require('express');
const router = express.Router();

module.exports = function (DataHelpers) {
  // Login page
  router.get('/', (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      return res.redirect('/');
    }
    const templateVars = {
      userName: '',
      userId,
      errorMessage: '',
    };
    res.render('login', templateVars);
  });

  // Registration page
  router.get('/new', (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      return res.redirect('/');
    }
    const templateVars = {
      userName: '',
      userId,
      errorMessage: '',
    };
    res.render('register', templateVars);
  });

  return router;
};
