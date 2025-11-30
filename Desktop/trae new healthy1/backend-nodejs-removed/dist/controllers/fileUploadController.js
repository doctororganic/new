"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProgressPhotos = exports.uploadAvatar = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const fileUploadService_1 = require("../services/fileUploadService");
const uploadAvatar = async (req, res, next) => {
    try {
        const { file, error } = await (0, fileUploadService_1.uploadFile)(req.files?.avatar);
        if (error) {
            throw new errorHandler_1.AppError(error.message, 400, 'FILE_UPLOAD_ERROR');
        }
        res.status(200).json({ success: true, data: file });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadAvatar = uploadAvatar;
const uploadProgressPhotos = async (req, res, next) => {
    try {
        const { files, error } = await (0, fileUploadService_1.uploadMultipleFiles)(req.files?.photos);
        if (error) {
            throw new errorHandler_1.AppError(error.message, 400, 'FILE_UPLOAD_ERROR');
        }
        res.status(200).json({ success: true, data: files });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadProgressPhotos = uploadProgressPhotos;
//# sourceMappingURL=fileUploadController.js.map