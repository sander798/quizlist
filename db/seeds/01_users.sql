-- Insert data into the 'users' table
INSERT INTO users (name, password, email)
VALUES
  ('John Doe', 'password123', 'john.doe@example.com'),
  ('Jane Smith', 'pass456', 'jane.smith@example.com'),
  ('Michael Johnson', 'mikepass', 'michael.johnson@example.com');

-- Insert data into the 'quizzes' table
INSERT INTO quizzes (title, description, is_public, user_id)
VALUES
  ('Math Quiz', 'Test your math skills', TRUE, 1),
  ('Science Quiz', 'Test your science knowledge', TRUE, 2),
  ('History Quiz', 'Test your history knowledge', FALSE, 3);

-- Insert data into the 'questions' table (mix of text and multiple choice)
INSERT INTO questions (text, quiz_id)
VALUES
  ('What is 2 + 2?', 1),  -- Multiple choice question
  ('Who discovered penicillin?', 2),  -- Multiple choice question
  ('In which year did World War II end?', 3),  -- Multiple choice question
  ('What is your opinion on climate change?', 1),  -- Text answer question
  ('Describe a memorable experience from your childhood.', 2),  -- Text answer question
  ('What is the capital of France?', 1),  -- Multiple choice question
  ('Describe your favorite book.', 1),  -- Text answer question
  ('What is your favorite movie?', 1),  -- Text answer question
  ('Describe your dream vacation.', 1);  -- Text answer question

-- Insert data into the 'answers' table (for multiple choice questions)
INSERT INTO answers (text, is_correct, question_id)
VALUES
  ('4', TRUE, 1),  -- Correct answer for question 1
  ('5', FALSE, 1),  -- Incorrect answer for question 1
  ('Alexander Fleming', TRUE, 2),  -- Correct answer for question 2
  ('Isaac Newton', FALSE, 2),  -- Incorrect answer for question 2
  ('1945', TRUE, 3),  -- Correct answer for question 3
  ('1950', FALSE, 3);  -- Incorrect answer for question 3

-- Insert data into the 'results' table
INSERT INTO results (quiz_id, user_id, date, score)
VALUES
  (1, 1, '2023-09-20', 8),  -- Sample result for quiz 1 and user 1
  (2, 2, '2023-09-21', 7),  -- Sample result for quiz 2 and user 2
  (3, 3, '2023-09-22', 9);  -- Sample result for quiz 3 and user 3

-- Insert data into the 'result_questions' table for each result
INSERT INTO result_questions (result_id, question_id, selected_answer_id, user_response)
VALUES
  (1, 1, 1, NULL),  -- Sample result for question 1 in result 1 (selected answer: 1)
  (1, 2, 3, NULL),  -- Sample result for question 2 in result 1 (selected answer: 3)
  (1, 3, 5, NULL),  -- Sample result for question 3 in result 1 (selected answer: 5)

  (2, 4, 2, NULL),  -- Sample result for question 4 in result 2 (selected answer: 2)
  (2, 5, 4, NULL),  -- Sample result for question 5 in result 2 (selected answer: 4)
  (2, 6, 1, NULL),  -- Sample result for question 6 in result 2 (selected answer: 1)
  
  (3, 7, NULL, 'This is a text answer.'),  -- Sample result for question 7 in result 3 (text answer)
  (3, 8, NULL, 'Another text answer.'),  -- Sample result for question 8 in result 3 (text answer)
  (3, 9, NULL, 'Yet another text answer.');  -- Sample result for question 9 in result 3 (text answer)