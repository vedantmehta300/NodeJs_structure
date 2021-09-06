const path = require('path');
const {createSuccessfullyResponse} = require("../../../helper/successResponse.helper");
const {generateUnhandledRequest} = require("../../../helper/errorHandler.helper");
const {generateBadRequest} = require("../../../helper/errorHandler.helper");
const {NULL_SHING_VALUE, isInvalidObjectId} = require("../../../helper/common.helper");
const videoDb = require("./video.Dal");
const videoHelper = require("./video.helper");
const {log4js} = require('../../../services/logger');
const UPLOAD_PATH = path.join(__dirname, "../../../../media/video");
const fileUploadHelper = require("../../../helper/file.upload.helper");
const log = log4js.getLogger("video.controller");
const config = require('../../../configuration/config');

/**
 * upload videos
 */
async function uploadVideo(req, res) {
    try {
        fileUploadHelper.fileUpload({ fieldName:"video" , uploadPath: UPLOAD_PATH })( req, res, err => {
            if (!req.file) {
                log.error(err);
                const exception = generateBadRequest("Error in upload file");
                return res.status(exception.statusCode).json(exception);
            }
            const videoData = {
                name: req.file.originalname,
                url: config.server.BASE_URL + 'video/' + encodeURI(req.file.filename),
            };
            createSuccessfullyResponse("Video uploaded successfully", videoData, "VIDEO_UPLOADED").then((successResponse) => {
                res.status(successResponse.statusCode).json(successResponse)
            });
        });
    } catch (e) {
        log.error("uploadVideo unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest();
        return res.status(e.statusCode).json(exception)
    }
}
/**
 * Creates video
 */
async function addVideo(req, res) {
    try {
        const {name, url, topicId, subjectId } = req.body;
        const createdBy = req.user._id;

        if(NULL_SHING_VALUE.includes(url) || isInvalidObjectId(topicId,subjectId)) {
            const exception = generateBadRequest("Missing some important fields to add videos");
            return res.status(exception.statusCode).json(exception);
        }

        const videoData = {
            name,
            url,
            topicId,
            subjectId,
            createdBy
        };
       const newVideoData = await videoDb.videoCreate(videoData);

       const successResponse =  await createSuccessfullyResponse("Video added successfully", newVideoData, "VIDEO_ADDED");
       res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        log.error("addVideo unhandled", e);
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        const exception = await generateUnhandledRequest();
        return res.status(e.statusCode).json(exception)
    }
}

/**
 * Update video
 */
async function updateVideo(req, res) {
    try {
        const { videoId } = req.params;

        if (isInvalidObjectId(videoId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const updatedVideo =await videoDb.videoUpdateById(videoId,req.body, {new: true});

        const successResponse = await createSuccessfullyResponse("Video updated successfully", updatedVideo, "VIDEO_UPDATED");
        res.status(successResponse.statusCode).json(successResponse)

    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("updateVideo unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * delete video
 */
async function deleteVideo(req, res) {
    try {
        const { videoId } = req.params;

        if (isInvalidObjectId(videoId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const videoData =  await videoDb.videoDeleteById(videoId);
        await videoHelper.removeFile(videoData.url);
        const successResponse = await createSuccessfullyResponse("Video deleted successfully", {},"VIDEO_DELETED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("deleteVideo unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get video by Id
 */
async function getVideo(req, res) {
    try {
        const { videoId } = req.params;

        if (isInvalidObjectId(videoId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const video = await videoDb.videoFindById(videoId);

        if(!video){
            throw await generateBadRequest("Video not found ")
        }
        const successResponse = await createSuccessfullyResponse("Video fetched successfully", video, "VIDEO_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getVideo unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get video by topicId
 */
async function getPaginatedTopicVideo(req, res) {
    try {
        const { topicId } = req.params;

        const { page,limit,searchParam} = req.query;

        const options= {
            page:parseInt(page,10)||1,
            limit:parseInt(limit,10)||10,
            sort: {
                createdAt: 'desc',
            },
        };

        if (isInvalidObjectId(topicId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        let query = { topicId };

        if (!NULL_SHING_VALUE.includes(searchParam)) {
            query.name = {$regex: searchParam, $options: 'i'};
        }
        const videoData = await videoDb.findVideoPaginated(query,options);

        const successResponse = await createSuccessfullyResponse("Topic video fetched successfully", videoData, "TOPIC_VIDEO_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getTopicVideo unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

/**
 * get video by topicId
 */
async function getSubjectVideo(req, res) {
    try {
        const { subjectId } = req.params;

        if (isInvalidObjectId(subjectId) ) {
            throw await generateBadRequest("the request missing some importance fields")
        }

        const videoData = await videoDb.findVideo({subjectId}, null);

        const successResponse = await createSuccessfullyResponse("Topic video fetched successfully", videoData, "TOPIC_VIDEO_FETCHED");
        res.status(successResponse.statusCode).json(successResponse)
    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json(e)
        }
        log.error("getAllTopicVideo unhandled", e);
        const exception = await generateUnhandledRequest("unhandled error occurring..");
        return res.status(exception.statusCode).json(exception)
    }
}

module.exports = {
    uploadVideo,
    addVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    getPaginatedTopicVideo,
    getSubjectVideo
};
