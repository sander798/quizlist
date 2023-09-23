const express = require('express');
const router = express.Router();
const DataHelpers = require('./attempt');
const db = require('../db/queries/users');

module.exports = function (DataHelpers) {
  // New quiz creation page
  router.get('/', (req, res) => {
    //const userId = 0;

    // Use the getUserById function from DataHelpers
    /*DataHelpers.getUserById(userId)
      .then((user) => {
        
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
        res.status(500).send('Internal Server Error');
      });*/
    const templateVars = { userName: "John Doe" };
    res.render('new_quiz', templateVars);
  });
  
  router.post("/create", (req, res) => { 
    console.log(req.body);
    return db.addQuiz(req.body.quiz)
    .then((data) => {
      console.log("data: " + data);
      req.body.questions.forEach((question) => {
        db.addQuestion({
          text: question.q,
          quiz_id: data.id,
        })
        .then((data) => {
          db.addAnswer({
            text: question.a,
            is_correct: true,
            question_id: data.id,
          })
        })
        .catch((error) => {
          console.error(error);
          // Error Handling
          res.status(500).send('lsdnfjlsdfnb');
        });
      });
      
      return data;
    })
    .then((data) => {
      res.redirect(`/quiz/${data.id}`);
    })
    .catch((error) => {
      console.error(error);
      // Error Handling
      res.status(500).send('Internal Server Error');
    });
  });

  return router;
};

