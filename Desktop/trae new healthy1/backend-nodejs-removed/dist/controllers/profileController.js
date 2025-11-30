"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const auth_1 = require("../middleware/auth");
const profileService_1 = __importDefault(require("../services/profileService"));
const getUserProfile = async (req, res, next) => {
    try {
        const userId = (0, auth_1.getUser)(req).id;
        const profile = await profileService_1.default.getProfile(userId);
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = (0, auth_1.getUser)(req).id;
        const data = req.body;
        const updatedProfile = await profileService_1.default.updateProfile(userId, data);
        res.json({ success: true, data: updatedProfile });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=profileController.js.map