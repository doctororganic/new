"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const database_1 = __importDefault(require("@/config/database"));
const router = (0, express_1.Router)();
const createWorkoutSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    description: joi_1.default.string().max(500).optional(),
    durationMinutes: joi_1.default.number().min(5).max(300).required(),
    caloriesBurned: joi_1.default.number().min(0).max(3000).optional(),
    date: joi_1.default.string().isoDate().required(),
});
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    const userId = req.user.id;
    const { from, to } = req.query;
    const where = { userId };
    if (from && to) {
        where.date = { gte: new Date(from), lte: new Date(to) };
    }
    const workouts = await database_1.default.workoutLog.findMany({ where, orderBy: { date: 'desc' } });
    res.json({ success: true, data: workouts });
});
router.post('/', (0, validation_1.validateWithJoi)(createWorkoutSchema), async (req, res) => {
    const userId = req.user.id;
    const input = req.body;
    const created = await database_1.default.workoutLog.create({
        data: {
            userId,
            name: input.name,
            description: input.description,
            durationMinutes: input.durationMinutes,
            caloriesBurned: input.caloriesBurned,
            date: new Date(input.date),
        },
    });
    res.status(201).json({ success: true, data: created });
});
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await database_1.default.workoutLog.delete({ where: { id } });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=workouts.js.map