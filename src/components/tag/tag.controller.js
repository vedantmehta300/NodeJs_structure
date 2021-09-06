const Tag=require('./tag.model');
const dbTag=require('./tag.DAL');
const {generateUnhandledRequest, generateBadRequest} = require('../../helper/errorHandler.helper');
const {createSuccessfullyResponse} = require('../../helper/successResponse.helper');
const {log4js} = require('../../services/logger');
const log = log4js.getLogger("tag.controller");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../helper/common.helper");

async function createTag(req,res) {
    try {
        const { name, weight } = req.body;
        const createdBy = req.user._id;

        if (NULL_SHING_VALUE.includes(name) && NULL_SHING_VALUE.includes(weight)) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const tag = await dbTag.findOneTag({name});

        if(tag){
            throw await generateBadRequest("Tag found with same name ")
        }

        const newTag= await dbTag.create({name, weight, createdBy});

        const successResponse = await createSuccessfullyResponse("Tag created successfully", newTag, "TAG_CREATE");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("createTag:   unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while  create tag');
        return res.status(e.statusCode).json(exception)
    }
};

async function updateTag(req,res){
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isInvalidObjectId(id) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const tag = await  dbTag.findOneTag({_id:{$ne:id},name:req.body.name});
        if(tag){
            throw await generateBadRequest("Tag found with same name ")
        }
        const updatedTag=await dbTag.updateTagById(id,{$set: { name }}, {new: true});
        const successResponse = await createSuccessfullyResponse("Tag update successfully", updatedTag, "TAG_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("updateTag  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while update tag');
        return res.status(e.statusCode).json(exception)
    }
};

async function getTagWithPaginate(req,res){
    try{
        const { page,limit,searchParam} = req.query;

        const options={
            page:parseInt(page,10)||1,
            limit:parseInt(limit,10)||10,
            sort: {
                createdAt: 'desc',
            },
        };
        let query={};

        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const tags=await Tag.paginate(query,options);

        const successResponse = await createSuccessfullyResponse("Tag fetched successfully", tags, "TAG_FETCHED_PAGINATED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("getTagWithPaginate  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while fetch tag');
        return res.status(e.statusCode).json(exception)
    }

};

async function deleteTag(req,res){
    try {
        const { id } = req.params;

        if (isInvalidObjectId(id) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        await dbTag.deleteTagById(id);
        const successResponse = await createSuccessfullyResponse("Tag deleted successfully", {}, "TAG_DELETED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("deleteTag  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while delete tag');
        return res.status(e.statusCode).json(exception)
    }
};

async function getTags(req,res){
    try {

        const { id } = req.params;

        if (isInvalidObjectId(id) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }
        const tags =await dbTag.findOneTag({_id:id});
        const successResponse = await createSuccessfullyResponse("Tag fetched successfully", tags, "TAG_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        log.error("getTags  unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest('Unexpected error occur while while get tags ');
        return res.status(e.statusCode).json(exception)
    }
};


module.exports={
    getTags,
    getTagWithPaginate,
    createTag,
    deleteTag,
    updateTag
};
