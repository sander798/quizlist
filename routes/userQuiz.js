const express = require('express');
const router = express.Router();
const { getUserById, getQuizResult, getQuizDetails, getQuiz, addQuizResult, getAnswersToQuestions } = require('../db/queries/users');
const DataHelpers = require('./attempt');

module.exports = function (DataHelpers) {
  // Create new quiz page
  router.get('/new', (req, res) => {
    const userId = req.session.userId;
    const templateVars = {}; // Declare templateVars

    if (!userId) {
      return res.redirect('/quizapp/login');
    }

    getUserById(userId)
      .then((user) => {
        templateVars.userName = user.name;
        res.render('quiz_form', templateVars);
      })
      .catch((error) => {
        console.error(error);
        // error handling
        res.status(500).send('Internal Server Error');
      });
  });

  // Page for results of all quizzes taken
  router.get('/results/:url', (req, res) => {
    const userId = req.session.userId;
    const templateVars = {};
    const url = req.params.url;

    templateVars.url = url;

    Promise.all([getUserById(userId), getQuizResult(url, userId)])
      .then(([user, results]) => {
        templateVars.userName = !user ? '' : user.name;
        templateVars.results = results;
        return results[0].quiz_id;
      })
      .then((quizId) => getAnswersToQuestions(quizId))
      .then((quiz) => {
        templateVars.quiz = quiz;
        res.render('quiz_stats', templateVars);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
        res.status(500).send('Internal Server Error');
      });
  });

  // Page to take a quiz
router.get('/:url', (req, res) => {
  const userId = 1;
  
  Promise.all([getUserById(userId), getQuizDetails(req.params.url)])
    .then(([user, quiz]) => {
      const templateVars = {
        userName: "John Doe",
        quiz,
      };
      console.log(templateVars.quiz);
      res.render('quiz', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // Error Handling
      res.status(500).send('Internal Server Error');
    });
  
  //const userId = req.session.userId;

  /*Promise.all([DataHelpers.getUserById(userId), DataHelpers.getQuiz({ url: req.params.url })])
    .then(([user, quiz]) => {
      const templateVars = {
        userName: !user ? '' : user.name,
        quiz,
      };
      res.render('quiz', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // error handling
      res.status(500).send('Internal Server Error');
    });*/
});

// Fetch  list of available quizzes
router.get('/quizzes', (req, res) => {
  DataHelpers.getQuizzes()
    .then((quizzes) => {
      const templateVars = {
        quizzes,
      };
      res.render('quiz_list', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // error handling
      res.status(500).send('Internal Server Error');
    });
});

  router.post("/:id", (req, res) => { 
    //console.log(req.params.id);
    //console.log("score: " + req.body.score);
    return getQuiz(req.params.id)
    .then((data) => {
      /*const { quizId, userId, date, score, questionResults } = quizResult;

  return db.query(
    'INSERT INTO results (quiz_id, user_id, date, score) VALUES ($1, $2, $3, $4) RETURNING id',
    [quizId, userId, date, score]
  )*/
      console.log("data: " + data);
      return addQuizResult({
        quizId: req.params.id,
        userId: 1,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        score: req.body.score,
        questionResults: [{ 
          questionId: 1,
          selectedAnswerId: 1,
          userResponse: 'something',
        }], 
      })
      .catch((error) => {
        console.error(error);
        // Error Handling
        res.status(500).send('Internal Server Error');
      });
    })
    .then((data) => {
      res.redirect(`/attempt/${req.params.id}`);
    })
    .catch((error) => {
      console.error(error);
      // Error Handling
      res.status(500).send('Internal Server Error');
    });
  });


  return router;
};
