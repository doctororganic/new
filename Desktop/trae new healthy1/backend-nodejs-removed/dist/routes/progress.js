"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const progressService_1 = __importDefault(require("@/services/progressService"));
const router = (0, express_1.Router)();
const rangeSchema = joi_1.default.object({
    from: joi_1.default.string().isoDate().optional(),
    to: joi_1.default.string().isoDate().optional(),
});
const addWeightSchema = joi_1.default.object({
    weight: joi_1.default.number().min(20).max(400).required(),
    bodyFat: joi_1.default.number().min(0).max(70).optional(),
    muscle: joi_1.default.number().min(0).max(200).optional(),
    notes: joi_1.default.string().max(300).optional(),
    recordDate: joi_1.default.string().isoDate().required(),
});
const addMeasurementSchema = joi_1.default.object({
    chest: joi_1.default.number().min(0).max(200).optional(),
    waist: joi_1.default.number().min(0).max(200).optional(),
    hips: joi_1.default.number().min(0).max(200).optional(),
    arms: joi_1.default.number().min(0).max(100).optional(),
    thighs: joi_1.default.number().min(0).max(150).optional(),
    calves: joi_1.default.number().min(0).max(100).optional(),
    neck: joi_1.default.number().min(0).max(80).optional(),
    shoulders: joi_1.default.number().min(0).max(200).optional(),
    forearms: joi_1.default.number().min(0).max(80).optional(),
    wrist: joi_1.default.number().min(0).max(40).optional(),
    bodyFatCaliper: joi_1.default.number().min(0).max(70).optional(),
    notes: joi_1.default.string().max(300).optional(),
    measurementDate: joi_1.default.string().isoDate().required(),
});
router.use(auth_1.authenticateToken);
router.get('/weights', (0, validation_1.validateWithJoi)(rangeSchema, 'query'), async (req, res) => {
    const userId = req.user.id;
    const { from, to } = req.query;
    const data = await progressService_1.default.listWeights(userId, from ? new Date(from) : undefined, to ? new Date(to) : undefined);
    res.json({ success: true, data });
});
router.post('/weights', (0, validation_1.validateWithJoi)(addWeightSchema), async (req, res) => {
    const userId = req.user.id;
    const input = req.body;
    const created = await progressService_1.default.addWeight({
        userId,
        weight: input.weight,
        bodyFat: input.bodyFat,
        muscle: input.muscle,
        notes: input.notes,
        recordDate: new Date(input.recordDate),
    });
    res.status(201).json({ success: true, data: created });
});
router.delete('/weights/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await progressService_1.default.deleteWeight(userId, id);
    res.status(204).send();
});
router.get('/measurements', (0, validation_1.validateWithJoi)(rangeSchema, 'query'), async (req, res) => {
    const userId = req.user.id;
    const { from, to } = req.query;
    const data = await progressService_1.default.listMeasurements(userId, from ? new Date(from) : undefined, to ? new Date(to) : undefined);
    res.json({ success: true, data });
});
router.post('/measurements', (0, validation_1.validateWithJoi)(addMeasurementSchema), async (req, res) => {
    const userId = req.user.id;
    const input = req.body;
    const created = await progressService_1.default.addMeasurement({
        userId,
        chest: input.chest,
        waist: input.waist,
        hips: input.hips,
        arms: input.arms,
        thighs: input.thighs,
        calves: input.calves,
        neck: input.neck,
        shoulders: input.shoulders,
        forearms: input.forearms,
        wrist: input.wrist,
        bodyFatCaliper: input.bodyFatCaliper,
        notes: input.notes,
        measurementDate: new Date(input.measurementDate),
    });
    res.status(201).json({ success: true, data: created });
});
router.delete('/measurements/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await progressService_1.default.deleteMeasurement(userId, id);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=progress.js.map