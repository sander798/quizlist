-- Drop and recreate tables 

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS AnswerIDnswers CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS result_questions CASCADE;


CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL    
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY NOT NULL,
    text TEXT NOT NULL,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY NOT NULL,
    text TEXT,
    is_correct BOOLEAN,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY NOT NULL,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE,
    score INTEGER
);
    

CREATE TABLE result_questions (
    id SERIAL PRIMARY KEY NOT NULL,
    result_id INTEGER REFERENCES results(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
    user_response TEXT 
);
