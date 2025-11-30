"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const meals_1 = __importDefault(require("./meals"));
const workouts_1 = __importDefault(require("./workouts"));
const progress_1 = __importDefault(require("./progress"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use('/health', health_1.default);
router.use('/meals', meals_1.default);
router.use('/workouts', workouts_1.default);
router.use('/progress', progress_1.default);
router.use('/auth', auth_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map