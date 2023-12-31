// Client-facing scripts here
document.addEventListener('DOMContentLoaded', () => {
  
  // Click event for the "Add Question" button on the new quiz page (new_quiz.ejs)
  $('#add-question-button').click(function() {
    const newQuestion = $(`
      <section class="new-question">
        <textarea class="new-question-desc">What is your question?</textarea>
        <textarea class="new-question-answer">What is the answer?</textarea>
      </section>
    `);
    
    $('.question-container').append(newQuestion);
  });
  
  // Click event for the "Create Quiz" button on the new quiz page (new_quiz.ejs)
  $('#create-quiz-button').click(function() {
    const quizData = {
      quiz: {
        title: $('#new-quiz-title-input').val(),
        description: $('#new-quiz-desc-input').val(),
        visibility: !$('#toggle-private-box').is(":checked"),
        userId: 1,
      },
      questions: {
        
      },
    };
    
    const pageQuestions = $('.new-question').toArray();
    
    for (let i = 0; i < pageQuestions.length; i++) {
      //console.log(pageQuestions[i].childNodes);
      quizData.questions[i] = {
        q: pageQuestions[i].childNodes[1].value,
        a: pageQuestions[i].childNodes[3].value,
      };
    }
    
    $.post("/quiz/new/create", quizData);
  });

  // Click event for the "Submit Answers" button on the quiz page (quiz.ejs)
  $('#submit-answers-button').click(function() {
    //Tally user score    
    new Promise((resolve, reject) => {
      let score = 0;
      
      for (let question of $('.question').toArray()){
        const userAnswer = question.childNodes[3].value;
        const trueAnswer = "";//TODO: add db lookup...and figure out how to resolve asynchronously
        
        if (userAnswer == trueAnswer) {
          score++;
        }
      }
      
      resolve(score);
    })
    .then((score) => {
      $.post(window.location.href, {score: score}, function(data) {
        // Assuming data.quizId contains the ID of the quiz the user just attempted
        window.location.href = '/quiz/' + data.quizId + '/results'; // Redirect to the results page
      });
    });
  });
});
