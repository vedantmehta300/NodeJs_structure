const express = require('express');

const route = express();

const topicController = require('./topic.controller');


route.post('/', topicController.createTopic);

route.get('/:topicId', topicController.getTopic);

route.get('/all/:subjectId', topicController.getSubjectTopic);

route.get('/subject/:subjectId', topicController.getTopics);

route.put('/:topicId', topicController.updateTopic);

route.delete('/:topicId', topicController.deleteTopic);


module.exports = route;
