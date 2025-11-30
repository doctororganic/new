"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealService = void 0;
const database_1 = __importDefault(require("@/config/database"));
exports.mealService = {
    async listByDate(userId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const meals = await database_1.default.meal.findMany({
            where: { userId, mealDate: { gte: start, lte: end } },
            include: { foodLogs: true },
            orderBy: [{ mealDate: 'asc' }],
        });
        const totals = meals.reduce((acc, m) => {
            acc.calories += m.calories;
            acc.protein += m.protein;
            acc.carbs += m.carbs;
            acc.fat += m.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        return { meals, totals };
    },
    async create(input) {
        return database_1.default.meal.create({ data: input });
    },
    async update(mealId, userId, input) {
        return database_1.default.meal.update({
            where: { id: mealId },
            data: input,
        });
    },
    async remove(mealId, userId) {
        await database_1.default.foodLog.deleteMany({ where: { mealId } });
        return database_1.default.meal.delete({ where: { id: mealId } });
    },
    async addFoodLog(params) {
        const log = await database_1.default.foodLog.create({ data: params });
        const agg = await database_1.default.foodLog.aggregate({
            _sum: { calories: true, protein: true, carbs: true, fat: true },
            where: { mealId: params.mealId },
        });
        await database_1.default.meal.update({
            where: { id: params.mealId },
            data: {
                calories: agg._sum.calories ?? 0,
                protein: agg._sum.protein ?? 0,
                carbs: agg._sum.carbs ?? 0,
                fat: agg._sum.fat ?? 0,
            },
        });
        return log;
    },
    async removeFoodLog(foodLogId, mealId) {
        await database_1.default.foodLog.delete({ where: { id: foodLogId } });
        const agg = await database_1.default.foodLog.aggregate({
            _sum: { calories: true, protein: true, carbs: true, fat: true },
            where: { mealId },
        });
        await database_1.default.meal.update({
            where: { id: mealId },
            data: {
                calories: agg._sum.calories ?? 0,
                protein: agg._sum.protein ?? 0,
                carbs: agg._sum.carbs ?? 0,
                fat: agg._sum.fat ?? 0,
            },
        });
    },
};
exports.default = exports.mealService;
//# sourceMappingURL=mealService.js.map