"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../config/logger");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'avatar') {
            uploadPath += 'avatars/';
        }
        else if (file.fieldname === 'progressPhoto') {
            uploadPath += 'progress-photos/';
        }
        else {
            uploadPath += 'general/';
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter
});
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        const singleUpload = exports.upload.single(fieldName);
        singleUpload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 5MB.'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            }
            else if (err) {
                logger_1.logger.error('File upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName, maxCount) => {
    return (req, res, next) => {
        const multipleUpload = exports.upload.array(fieldName, maxCount);
        multipleUpload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 5MB per file.'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: `Too many files. Maximum allowed is ${maxCount}.`
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            }
            else if (err) {
                logger_1.logger.error('File upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=upload.js.map