"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const mealService_1 = __importDefault(require("@/services/mealService"));
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const createMealSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    mealType: joi_1.default.string()
        .valid('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'MORNING_SNACK', 'AFTERNOON_SNACK', 'EVENING_SNACK', 'PRE_WORKOUT', 'POST_WORKOUT')
        .required(),
    mealDate: joi_1.default.string().isoDate().required(),
    description: joi_1.default.string().max(500).optional(),
    notes: joi_1.default.string().max(500).optional(),
});
const updateMealSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    mealType: joi_1.default.string().valid('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'MORNING_SNACK', 'AFTERNOON_SNACK', 'EVENING_SNACK', 'PRE_WORKOUT', 'POST_WORKOUT').optional(),
    mealDate: joi_1.default.string().isoDate().optional(),
    description: joi_1.default.string().max(500).optional(),
    notes: joi_1.default.string().max(500).optional(),
    isCompleted: joi_1.default.boolean().optional(),
});
router.use(auth_1.authenticateToken);
router.get('/', (0, validation_1.validateWithJoi)(joi_1.default.object({ date: joi_1.default.string().isoDate() })), async (req, res) => {
    const userId = req.user.id;
    const dateStr = req.query.date;
    const date = new Date(dateStr);
    const { meals, totals } = await mealService_1.default.listByDate(userId, date);
    res.json({ success: true, data: { meals, totals } });
});
router.post('/', (0, validation_1.validateWithJoi)(createMealSchema), async (req, res) => {
    const userId = req.user.id;
    const { name, mealType, mealDate, description, notes } = req.body;
    const newMeal = await mealService_1.default.create({
        userId,
        name,
        mealType,
        mealDate: new Date(mealDate),
        description,
        notes,
    });
    res.status(201).json({ success: true, data: newMeal });
});
router.patch('/:id', (0, validation_1.validateWithJoi)(updateMealSchema), async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;
    if (updates.mealDate) {
        updates.mealDate = new Date(updates.mealDate);
    }
    const updatedMeal = await mealService_1.default.update(id, userId, updates);
    res.json({ success: true, data: updatedMeal });
});
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await mealService_1.default.remove(id, userId);
    res.status(204).send();
});
router.post('/:id/foods', (0, validation_1.validateWithJoi)(joi_1.default.object({
    foodId: joi_1.default.string().required(),
    quantity: joi_1.default.number().positive().required(),
    servingSize: joi_1.default.number().positive().required(),
    servingUnit: joi_1.default.string().max(20).required(),
    calories: joi_1.default.number().min(0).required(),
    protein: joi_1.default.number().min(0).required(),
    carbs: joi_1.default.number().min(0).required(),
    fat: joi_1.default.number().min(0).required(),
    fiber: joi_1.default.number().min(0).optional(),
    sugar: joi_1.default.number().min(0).optional(),
    sodium: joi_1.default.number().min(0).optional(),
    cholesterol: joi_1.default.number().min(0).optional(),
    logDate: joi_1.default.string().isoDate().required(),
    notes: joi_1.default.string().max(300).optional()
})), async (req, res) => {
    const userId = req.user.id;
    const { id: mealId } = req.params;
    const data = req.body;
    const log = await mealService_1.default.addFoodLog({ ...data, userId, mealId });
    res.status(201).json({ success: true, data: log });
});
router.delete('/:mealId/foods/:foodLogId', async (req, res) => {
    const userId = req.user.id;
    const { mealId, foodLogId } = req.params;
    await mealService_1.default.removeFoodLog(foodLogId, mealId);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=meal.js.map