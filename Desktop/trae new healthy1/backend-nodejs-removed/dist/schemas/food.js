"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentFoodsSchema = exports.getPopularFoodsSchema = exports.scanBarcodeSchema = exports.getFoodCategoriesSchema = exports.deleteCustomFoodSchema = exports.updateCustomFoodSchema = exports.createCustomFoodSchema = exports.getFoodDetailsSchema = exports.searchFoodSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.searchFoodSchema = joi_1.default.object({
    query: joi_1.default.string().min(1).max(100).required().messages({
        'any.required': 'Search query is required',
        'string.min': 'Search query must be at least 1 character',
        'string.max': 'Search query cannot exceed 100 characters'
    }),
    limit: joi_1.default.number().integer().min(1).max(50).default(10),
    offset: joi_1.default.number().integer().min(0).default(0),
    category: joi_1.default.string().optional(),
    brand: joi_1.default.string().optional(),
    minCalories: joi_1.default.number().min(0).optional(),
    maxCalories: joi_1.default.number().min(0).optional(),
    sortBy: joi_1.default.string().valid('name', 'calories', 'protein', 'carbs', 'fat', 'popularity').default('relevance'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc')
});
exports.getFoodDetailsSchema = joi_1.default.object({
    foodId: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid food ID format',
        'any.required': 'Food ID is required'
    })
});
exports.createCustomFoodSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).required().messages({
        'any.required': 'Food name is required',
        'string.min': 'Food name must be at least 1 character',
        'string.max': 'Food name cannot exceed 100 characters'
    }),
    brand: joi_1.default.string().max(100).optional(),
    category: joi_1.default.string().max(50).required().messages({
        'any.required': 'Food category is required'
    }),
    description: joi_1.default.string().max(500).optional(),
    servingSize: joi_1.default.number().positive().required().messages({
        'any.required': 'Serving size is required',
        'number.positive': 'Serving size must be positive'
    }),
    servingUnit: joi_1.default.string().max(20).required().messages({
        'any.required': 'Serving unit is required'
    }),
    nutrition: joi_1.default.object({
        calories: joi_1.default.number().min(0).required(),
        protein: joi_1.default.number().min(0).required(),
        carbs: joi_1.default.number().min(0).required(),
        fat: joi_1.default.number().min(0).required(),
        fiber: joi_1.default.number().min(0).optional(),
        sugar: joi_1.default.number().min(0).optional(),
        sodium: joi_1.default.number().min(0).optional(),
        cholesterol: joi_1.default.number().min(0).optional(),
        saturatedFat: joi_1.default.number().min(0).optional(),
        transFat: joi_1.default.number().min(0).optional(),
        monounsaturatedFat: joi_1.default.number().min(0).optional(),
        polyunsaturatedFat: joi_1.default.number().min(0).optional(),
        vitaminA: joi_1.default.number().min(0).optional(),
        vitaminC: joi_1.default.number().min(0).optional(),
        vitaminD: joi_1.default.number().min(0).optional(),
        vitaminE: joi_1.default.number().min(0).optional(),
        vitaminK: joi_1.default.number().min(0).optional(),
        thiamine: joi_1.default.number().min(0).optional(),
        riboflavin: joi_1.default.number().min(0).optional(),
        niacin: joi_1.default.number().min(0).optional(),
        vitaminB6: joi_1.default.number().min(0).optional(),
        folate: joi_1.default.number().min(0).optional(),
        vitaminB12: joi_1.default.number().min(0).optional(),
        calcium: joi_1.default.number().min(0).optional(),
        iron: joi_1.default.number().min(0).optional(),
        magnesium: joi_1.default.number().min(0).optional(),
        phosphorus: joi_1.default.number().min(0).optional(),
        potassium: joi_1.default.number().min(0).optional(),
        zinc: joi_1.default.number().min(0).optional(),
        copper: joi_1.default.number().min(0).optional(),
        manganese: joi_1.default.number().min(0).optional(),
        selenium: joi_1.default.number().min(0).optional()
    }).required(),
    barcode: joi_1.default.string().max(50).optional(),
    isPublic: joi_1.default.boolean().default(false),
    tags: joi_1.default.array().items(joi_1.default.string().max(30)).optional()
});
exports.updateCustomFoodSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).optional(),
    brand: joi_1.default.string().max(100).optional(),
    category: joi_1.default.string().max(50).optional(),
    description: joi_1.default.string().max(500).optional(),
    servingSize: joi_1.default.number().positive().optional(),
    servingUnit: joi_1.default.string().max(20).optional(),
    nutrition: joi_1.default.object({
        calories: joi_1.default.number().min(0).optional(),
        protein: joi_1.default.number().min(0).optional(),
        carbs: joi_1.default.number().min(0).optional(),
        fat: joi_1.default.number().min(0).optional(),
        fiber: joi_1.default.number().min(0).optional(),
        sugar: joi_1.default.number().min(0).optional(),
        sodium: joi_1.default.number().min(0).optional(),
        cholesterol: joi_1.default.number().min(0).optional(),
        saturatedFat: joi_1.default.number().min(0).optional(),
        transFat: joi_1.default.number().min(0).optional(),
        monounsaturatedFat: joi_1.default.number().min(0).optional(),
        polyunsaturatedFat: joi_1.default.number().min(0).optional(),
        vitaminA: joi_1.default.number().min(0).optional(),
        vitaminC: joi_1.default.number().min(0).optional(),
        vitaminD: joi_1.default.number().min(0).optional(),
        vitaminE: joi_1.default.number().min(0).optional(),
        vitaminK: joi_1.default.number().min(0).optional(),
        thiamine: joi_1.default.number().min(0).optional(),
        riboflavin: joi_1.default.number().min(0).optional(),
        niacin: joi_1.default.number().min(0).optional(),
        vitaminB6: joi_1.default.number().min(0).optional(),
        folate: joi_1.default.number().min(0).optional(),
        vitaminB12: joi_1.default.number().min(0).optional(),
        calcium: joi_1.default.number().min(0).optional(),
        iron: joi_1.default.number().min(0).optional(),
        magnesium: joi_1.default.number().min(0).optional(),
        phosphorus: joi_1.default.number().min(0).optional(),
        potassium: joi_1.default.number().min(0).optional(),
        zinc: joi_1.default.number().min(0).optional(),
        copper: joi_1.default.number().min(0).optional(),
        manganese: joi_1.default.number().min(0).optional(),
        selenium: joi_1.default.number().min(0).optional()
    }).optional(),
    isPublic: joi_1.default.boolean().optional(),
    tags: joi_1.default.array().items(joi_1.default.string().max(30)).optional()
});
exports.deleteCustomFoodSchema = joi_1.default.object({
    foodId: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid food ID format',
        'any.required': 'Food ID is required'
    })
});
exports.getFoodCategoriesSchema = joi_1.default.object({
    includeCount: joi_1.default.boolean().default(false)
});
exports.scanBarcodeSchema = joi_1.default.object({
    barcode: joi_1.default.string().max(50).required().messages({
        'any.required': 'Barcode is required',
        'string.max': 'Barcode cannot exceed 50 characters'
    })
});
exports.getPopularFoodsSchema = joi_1.default.object({
    limit: joi_1.default.number().integer().min(1).max(20).default(10),
    category: joi_1.default.string().optional()
});
exports.getRecentFoodsSchema = joi_1.default.object({
    limit: joi_1.default.number().integer().min(1).max(20).default(10)
});
//# sourceMappingURL=food.js.map