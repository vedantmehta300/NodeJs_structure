const express = require('express');

const route = express();

const quizController = require('./quiz.controller');


route.post('/:topicId', quizController.createQuiz);

route.get('/:quizId', quizController.getQuiz);

route.get('/all/:topicId', quizController.getTopicQuiz);

route.get('/topic/:topicId', quizController.getQuizs);

route.get('/withoutPaginate/:topicId', quizController.getAllQuiz);

route.put('/:quizId', quizController.updateQuiz);

route.delete('/:quizId', quizController.deleteQuiz);


module.exports = route;
