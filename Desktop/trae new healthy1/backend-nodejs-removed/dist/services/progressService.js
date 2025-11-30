"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressService = void 0;
const database_1 = __importDefault(require("@/config/database"));
exports.progressService = {
    async listWeights(userId, from, to) {
        return database_1.default.progressRecord.findMany({
            where: {
                userId,
                recordDate: from && to ? { gte: from, lte: to } : undefined,
            },
            orderBy: { recordDate: 'asc' },
            select: { id: true, recordDate: true, weight: true, bodyFat: true, muscle: true, notes: true },
        });
    },
    async addWeight(input) {
        return database_1.default.progressRecord.create({
            data: input,
            select: { id: true, recordDate: true, weight: true, bodyFat: true, muscle: true, notes: true },
        });
    },
    async deleteWeight(userId, id) {
        return database_1.default.progressRecord.delete({ where: { id } });
    },
    async listMeasurements(userId, from, to) {
        return database_1.default.bodyMeasurement.findMany({
            where: {
                userId,
                measurementDate: from && to ? { gte: from, lte: to } : undefined,
            },
            orderBy: { measurementDate: 'asc' },
        });
    },
    async addMeasurement(input) {
        return database_1.default.bodyMeasurement.create({ data: input });
    },
    async deleteMeasurement(userId, id) {
        return database_1.default.bodyMeasurement.delete({ where: { id } });
    },
};
exports.default = exports.progressService;
//# sourceMappingURL=progressService.js.map