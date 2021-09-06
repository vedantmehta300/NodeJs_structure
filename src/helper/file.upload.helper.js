const multer = require('multer');
const fileSizeLimit = (1024 * 1024* 1024) * 10;

const fileStorage  = (uploadPath) =>
    multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadPath);
        },
        filename(req, file, cb) {
            cb(null,`${encodeURI(file.fieldname)}-${Date.now()+file.originalname}`);
        },
    });


const fileUpload = ({uploadPath,fieldName}) =>
    multer({
        dest: uploadPath,
        limits: {
            fileSize: fileSizeLimit
        },
        fileFilter: (req, file, cb) => {
            if (validateFile({fieldName, file})) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        },
        storage: fileStorage(uploadPath),
    }).single(fieldName);


/* Validate file type */
const validateFile = ({ fieldName, file }) => {
    switch (fieldName) {
        case 'video':
            return file.mimetype.split('/')[0].toLowerCase() === 'video';
        case 'icon':
            return file.mimetype.split('/')[0].toLowerCase() === 'image';
        default:
            return false;
    }
};

module.exports = {
    fileUpload
}
