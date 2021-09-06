const express = require('express');

const route = express();

const videoController = require('./video.controller');


route.post('/upload', videoController.uploadVideo);

route.post('/', videoController.addVideo);

route.get('/:videoId', videoController.getVideo);

route.get('/all/:topicId', videoController.getPaginatedTopicVideo);

route.get('/topic/:subjectId', videoController.getSubjectVideo);

route.put('/:videoId', videoController.updateVideo);

route.delete('/:videoId', videoController.deleteVideo);


module.exports = route;
