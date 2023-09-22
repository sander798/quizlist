// Client-facing scripts here
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  button.addEventListener('click', () => {
    alert('Button Clicked!');
  });

  // Click event for the "Take Quiz" button on the home page (index.ejs)
  $('#take-quiz-button').click(function () {
    window.location.href = '/quiz';
  });

  // Click event for the "Create New Quiz" button on the home page (index.ejs)
  $('#create-quiz-button').click(function () {
    window.location.href = '/quiz/new';
  });

  // Click event for the "Login" button on the home page (index.ejs)
  $('#login-button').click(function () {
    window.location.href = '/login';
  });

  // Click event for the "Register" button on the login page (login.ejs)
  $('#register-button').click(function () {
    window.location.href = '/login/new';
  });

  // Click event for the "Submit Answers" button on the quiz page (quiz.ejs)
  $('#submit-answers-button').click(function () {
    window.location.href = '/results';
  });
});
