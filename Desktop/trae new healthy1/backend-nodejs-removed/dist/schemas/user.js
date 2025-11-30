"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProgressPhotosSchema = exports.uploadAvatarSchema = exports.updateBodyMeasurementsSchema = exports.updateWeightSchema = exports.deleteUserAccountSchema = exports.changePasswordSchema = exports.userSettingsSchema = exports.updateUserProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateUserProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(50).optional(),
    lastName: joi_1.default.string().min(1).max(50).optional(),
    dateOfBirth: joi_1.default.date().iso().optional(),
    gender: joi_1.default.string().valid('male', 'female', 'other').optional(),
    height: joi_1.default.number().positive().max(300).optional(),
    weight: joi_1.default.number().positive().max(1000).optional(),
    activityLevel: joi_1.default.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active').optional(),
    goal: joi_1.default.string().valid('lose_weight', 'maintain', 'gain_weight', 'build_muscle').optional(),
    targetWeight: joi_1.default.number().positive().max(1000).optional(),
    dietaryRestrictions: joi_1.default.array().items(joi_1.default.string()).optional(),
    allergies: joi_1.default.array().items(joi_1.default.string()).optional(),
    units: joi_1.default.string().valid('metric', 'imperial').optional()
});
exports.userSettingsSchema = joi_1.default.object({
    notifications: joi_1.default.object({
        email: joi_1.default.boolean().optional(),
        push: joi_1.default.boolean().optional(),
        mealReminders: joi_1.default.boolean().optional(),
        waterReminders: joi_1.default.boolean().optional(),
        goalReminders: joi_1.default.boolean().optional(),
        weeklyReports: joi_1.default.boolean().optional()
    }).optional(),
    privacy: joi_1.default.object({
        profileVisibility: joi_1.default.string().valid('public', 'private', 'friends').optional(),
        shareProgress: joi_1.default.boolean().optional(),
        shareGoals: joi_1.default.boolean().optional()
    }).optional(),
    preferences: joi_1.default.object({
        language: joi_1.default.string().optional(),
        timezone: joi_1.default.string().optional(),
        theme: joi_1.default.string().valid('light', 'dark', 'auto').optional(),
        defaultMealSize: joi_1.default.string().valid('small', 'medium', 'large').optional()
    }).optional()
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: joi_1.default.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'New password is required'
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
    })
});
exports.deleteUserAccountSchema = joi_1.default.object({
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required to delete account'
    }),
    confirmation: joi_1.default.string().valid('DELETE').required().messages({
        'any.only': 'You must type "DELETE" to confirm account deletion',
        'any.required': 'Confirmation is required'
    })
});
exports.updateWeightSchema = joi_1.default.object({
    weight: joi_1.default.number().positive().max(1000).required().messages({
        'number.positive': 'Weight must be a positive number',
        'number.max': 'Weight seems unrealistic (max 1000)',
        'any.required': 'Weight is required'
    }),
    date: joi_1.default.date().iso().optional(),
    notes: joi_1.default.string().max(500).optional()
});
exports.updateBodyMeasurementsSchema = joi_1.default.object({
    chest: joi_1.default.number().positive().max(500).optional(),
    waist: joi_1.default.number().positive().max(500).optional(),
    hips: joi_1.default.number().positive().max(500).optional(),
    arms: joi_1.default.number().positive().max(200).optional(),
    thighs: joi_1.default.number().positive().max(200).optional(),
    bodyFat: joi_1.default.number().min(0).max(100).optional(),
    date: joi_1.default.date().iso().optional(),
    notes: joi_1.default.string().max(500).optional()
});
exports.uploadAvatarSchema = joi_1.default.object({
    avatar: joi_1.default.any().required().messages({
        'any.required': 'Avatar file is required'
    })
});
exports.uploadProgressPhotosSchema = joi_1.default.object({
    photos: joi_1.default.array().items(joi_1.default.any()).min(1).max(5).required().messages({
        'array.min': 'At least one photo is required',
        'array.max': 'Maximum 5 photos allowed',
        'any.required': 'Photos are required'
    }),
    date: joi_1.default.date().iso().optional(),
    notes: joi_1.default.string().max(500).optional()
});
//# sourceMappingURL=user.js.map