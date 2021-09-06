const express=require('express');
const route=express();
const SubjectController=require('./subject.controller')

route.post('/', SubjectController.createSubject);

route.put("/:subjectId", SubjectController.updateSubject);

route.get('/', SubjectController.getSubjectWithPaginate);

route.delete("/:subjectId", SubjectController.deleteSubject);

route.get('/all/:subjectId', SubjectController.getSubjectById);

route.get('/all', SubjectController.getSubjects);



module.exports= route;
