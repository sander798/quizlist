const db = require('../connection');

// Get all public quizzes.
const getQuizzes = () => {
  return db.query('SELECT id, title, description FROM quizzes WHERE is_public = true;')
      .then(data => {
      return data.rows;
    });
};

// Open the quiz by id.
const getQuiz = (quizId) => {
  return db.query('SELECT title, description FROM quizzes WHERE id = $1', [quizId])
      .then(data => {
      return data.rows;
    });
};

// Open the quiz by name.
const getQuizByName = (quizName) => {
  return db.query('SELECT description FROM quizzes WHERE title = $1', [quizName])
      .then(data => {
      return data.rows;
    });
};

// Add a new quiz to the database.
const addQuiz = function(quiz) {
  return pool.query(
    'INSERT INTO quizzes (title, description, is_public, user_id) VALUES ($1, $2, $3,$4) RETURNING *',
    [quiz.title, quiz.description, quiz.visibility, quiz.userId]
  )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

// Add a new user to the database.
const addUser = function(user) {
  return pool.query(
    'INSERT INTO users (name, password, email ) VALUES ($1, $2, $3) RETURNING *',
    [user.name, user.password, user.email]
  )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

// Add a new question to the database.
const addQuestion = function(question) {
  return pool.query(
    'INSERT INTO questions (text, quiz_id) VALUES ($1, $2) RETURNING *',
    [question.text, question.quiz_id]
  )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

// Add an answer of the qestion to the database.
const addAnswer = function(answer) {
  return pool.query(
    'INSERT INTO answers (text, is_correct, question_id) VALUES ($1, $2, $3) RETURNING *',
    [answer.text, answer.is_correct, answer.question_id]
  )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

// Add the result of the quiz
const addQuizResult = function(quizResult) {
  const { quizId, userId, date, score, questionResults } = quizResult;

  return pool.query(
    'INSERT INTO results (quiz_id, user_id, date, score) VALUES ($1, $2, $3, $4) RETURNING id',
    [quizId, userId, date, score]
  )
    .then((result) => {
      const resultId = result.rows[0].id;

      // Insert question results into the 'result_questions' table
      const questionResultQueries = questionResults.map((questionResult) => {
        const { questionId, selectedAnswerId, userResponse } = questionResult;
        return pool.query(
          'INSERT INTO result_questions (result_id, question_id, selected_answer_id, user_response) VALUES ($1, $2, $3, $4)',
          [resultId, questionId, selectedAnswerId, userResponse]
        );
      });

      return Promise.all(questionResultQueries)
        .then(() => resultId) // Return the result ID
        .catch((error) => {
          console.error('Error adding question results:', error.message);
          return null;
        });
    })
    .catch((error) => {
      console.error('Error adding quiz result:', error.message);
      return null;
    });
};
// Get a user by their ID.
const getUserById = (userId) => {
  return db.query('SELECT * FROM users WHERE id = $1', [userId])
    .then((data) => {
      return data.rows[0]; // Return the first user found (or null if not found).
    })
    .catch((error) => {
      console.error('Error retrieving user by ID:', error);
      return null;
    });
};

// Get all the details of a quiz
const getQuizDetails = (quizId) => {
  return pool.query(`
      SELECT 
          quizzes.id AS quiz_id,
          quizzes.title AS quiz_title,
          quizzes.description AS quiz_description,
          quizzes.is_public AS quiz_is_public,
          questions.id AS question_id,
          questions.text AS question_text,
          answers.id AS answer_id,
          answers.text AS answer_text,
          answers.is_correct AS answer_is_correct
      FROM 
          quizzes
      JOIN 
          questions ON quizzes.id = questions.quiz_id
      JOIN 
          answers ON questions.id = answers.question_id
      WHERE 
          quizzes.id = $1;`, [quizId])
    .then((result) => {
      return result.rows;  
    })
    .catch((error) => {
      console.error('Error fetching quiz details:', error);
      return [];
    });
};
// Get quiz results
const getQuizResult = (quizId, userId) => {
  return pool.query(`
    SELECT 
      quizzes.id AS quiz_id,
      quizzes.title AS quiz_title,
      quizzes.description AS quiz_description,
      questions.id AS question_id,
      questions.text AS question_text,
      answers.id AS answer_id,
      answers.text AS answer_text,
      answers.is_correct AS answer_is_correct,
      results.id AS result_id,
      results.date AS result_date,
      results.score AS result_score,
      result_questions.selected_answer_id,
      result_questions.user_response
    FROM 
      quizzes
    JOIN 
      questions ON quizzes.id = questions.quiz_id
    LEFT JOIN 
      answers ON questions.id = answers.question_id
    LEFT JOIN 
      results ON quizzes.id = results.quiz_id AND results.user_id = $2
    LEFT JOIN 
      result_questions ON questions.id = result_questions.question_id AND results.id = result_questions.result_id
    WHERE 
      quizzes.id = $1;`, [quizId, userId])
    .then((result) => {
      return result.rows;  // Return the entire array as it is
    })
    .catch((error) => {
      console.error('Error fetching quiz result:', error);
      return [];
    });
};

module.exports = { getQuizzes, addQuiz, addUser, getQuiz, getUserById, addAnswer, addQuestion, getQuizDetails, getQuizResult, addQuizResult, getQuizByName };
