"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const mealService_1 = __importDefault(require("@/services/mealService"));
const router = (0, express_1.Router)();
const dateQuerySchema = joi_1.default.object({
    date: joi_1.default.string().isoDate().required(),
});
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
const addFoodLogSchema = joi_1.default.object({
    foodId: joi_1.default.string().optional(),
    isCustom: joi_1.default.boolean().default(false),
    name: joi_1.default.string().when('isCustom', { is: true, then: joi_1.default.required(), otherwise: joi_1.default.optional() }),
    quantity: joi_1.default.number().positive().required(),
    servingSize: joi_1.default.number().positive().required(),
    servingUnit: joi_1.default.string().max(20).default('g'),
    calories: joi_1.default.number().min(0).required(),
    protein: joi_1.default.number().min(0).required(),
    carbs: joi_1.default.number().min(0).required(),
    fat: joi_1.default.number().min(0).required(),
    fiber: joi_1.default.number().min(0).optional(),
    sugar: joi_1.default.number().min(0).optional(),
    sodium: joi_1.default.number().min(0).optional(),
    cholesterol: joi_1.default.number().min(0).optional(),
    logDate: joi_1.default.string().isoDate().required(),
    notes: joi_1.default.string().max(300).optional(),
});
router.use(auth_1.authenticateToken);
router.get('/', (0, validation_1.validateWithJoi)(dateQuerySchema, 'query'), async (req, res) => {
    const userId = req.user.id;
    const { date } = req.query;
    const result = await mealService_1.default.listByDate(userId, new Date(date));
    res.json({ success: true, data: result });
});
router.post('/', (0, validation_1.validateWithJoi)(createMealSchema), async (req, res) => {
    const userId = req.user.id;
    const { name, mealType, mealDate, description, notes } = req.body;
    const created = await mealService_1.default.create({
        userId,
        name,
        mealType,
        mealDate: new Date(mealDate),
        description,
        notes,
    });
    res.status(201).json({ success: true, data: created });
});
router.patch('/:id', (0, validation_1.validateWithJoi)(updateMealSchema), async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const input = req.body;
    if (input.mealDate)
        input.mealDate = new Date(input.mealDate);
    const updated = await mealService_1.default.update(id, userId, input);
    res.json({ success: true, data: updated });
});
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await mealService_1.default.remove(id, userId);
    res.status(204).send();
});
router.post('/:id/foods', (0, validation_1.validateWithJoi)(addFoodLogSchema), async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const input = req.body;
    const created = await mealService_1.default.addFoodLog({
        userId,
        mealId: id,
        foodId: input.foodId,
        isCustom: input.isCustom,
        name: input.name,
        quantity: input.quantity,
        servingSize: input.servingSize,
        servingUnit: input.servingUnit,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        fiber: input.fiber,
        sugar: input.sugar,
        sodium: input.sodium,
        cholesterol: input.cholesterol,
        logDate: new Date(input.logDate),
        notes: input.notes,
    });
    res.status(201).json({ success: true, data: created });
});
router.delete('/:mealId/foods/:foodLogId', async (req, res) => {
    const { mealId, foodLogId } = req.params;
    await mealService_1.default.removeFoodLog(foodLogId, mealId);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=meals.js.map