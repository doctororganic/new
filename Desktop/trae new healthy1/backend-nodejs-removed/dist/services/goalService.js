"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalService = void 0;
const database_1 = __importDefault(require("@/config/database"));
exports.goalService = {
    async list(userId) {
        return database_1.default.nutritionGoal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    },
    async active(userId) {
        return database_1.default.nutritionGoal.findFirst({ where: { userId, isActive: true }, orderBy: { createdAt: 'desc' } });
    },
    async create(input) {
        await database_1.default.nutritionGoal.updateMany({ where: { userId: input.userId, isActive: true }, data: { isActive: false } });
        return database_1.default.nutritionGoal.create({ data: { ...input, isActive: true } });
    },
    async update(id, userId, input) {
        return database_1.default.nutritionGoal.update({ where: { id }, data: input });
    },
    async remove(id, userId) {
        return database_1.default.nutritionGoal.delete({ where: { id } });
    },
};
exports.default = exports.goalService;
//# sourceMappingURL=goalService.js.map