// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const { getUserById, getQuizzes } = require('./db/queries/users'); // Import necessary queries

const PORT = process.env.PORT || 8080;
const app = express();

const DataHelpers = require('./routes/attempt');

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes
const quizRoutes = require('./routes/users_quiz')(DataHelpers);
const attemptRoutes = require('./routes/attempt')(DataHelpers);
const loginRoutes = require('./routes/login')(DataHelpers);

app.use('/quiz/new', quizRoutes);
app.use('/attempt', attemptRoutes);
app.use('/quiz', loginRoutes);

// Home page
app.get('/', (req, res) => {
  const userId = 0;

  Promise.all([getUserById(userId), getQuizzes()])
    .then(([user, quizzes]) => {
      const templateVars = {
        userName: !user ? '' : user.name,
        quizzes,
      };
      res.render('quiz', templateVars);
    })
    .catch((error) => {
      console.error(error);
      // Error Handling
      res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
