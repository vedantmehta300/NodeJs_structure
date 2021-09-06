const express=require('express');
const route=express();
const tagController=require('./tag.controller');

route.post('/', tagController.createTag);

route.put("/:id", tagController.updateTag);

route.get('/', tagController.getTagWithPaginate);

route.delete("/:id", tagController.deleteTag);

route.get('/:id', tagController.getTags);



module.exports= route;
