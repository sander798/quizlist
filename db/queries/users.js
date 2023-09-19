const db = require('../connection');

// Get all public quizzes.
const getQuizzes = () => {
  return db.query("SELECT QuizID, Title, Description FROM Quizzes WHERE Visibility = 'public';")
      .then(data => {
      return data.rows;
    });
};

// Open the quiz.
const getQuiz = (quizId) => {
  return db.query('SELECT Title, Description FROM Quizzes WHERE QuizID = $1', [quizId])
      .then(data => {
      return data.rows;
    });
};


// Add a new quiz to the database.

const addQuiz = function(quiz) {
  return pool.query(
    'INSERT INTO Quizzes (Title, Description, Visibility, CreatorUserID) VALUES ($1, $2, $3,$4) RETURNING *',
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

module.exports = { getQuizzes, addQuiz, addUser, getQuiz };
