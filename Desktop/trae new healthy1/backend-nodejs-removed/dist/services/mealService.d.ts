export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'MORNING_SNACK' | 'AFTERNOON_SNACK' | 'EVENING_SNACK' | 'PRE_WORKOUT' | 'POST_WORKOUT';
export interface CreateMealInput {
    userId: string;
    name: string;
    mealType: MealType;
    mealDate: Date;
    description?: string;
    notes?: string;
}
export interface UpdateMealInput {
    name?: string;
    mealType?: MealType;
    mealDate?: Date;
    description?: string;
    notes?: string;
    isCompleted?: boolean;
}
export declare const mealService: {
    listByDate(userId: string, date: Date): Promise<{
        meals: any;
        totals: any;
    }>;
    create(input: CreateMealInput): Promise<any>;
    update(mealId: string, userId: string, input: UpdateMealInput): Promise<any>;
    remove(mealId: string, userId: string): Promise<any>;
    addFoodLog(params: {
        userId: string;
        mealId: string;
        foodId?: string;
        isCustom?: boolean;
        name?: string;
        quantity: number;
        servingSize: number;
        servingUnit?: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
        cholesterol?: number;
        logDate: Date;
        notes?: string;
    }): Promise<any>;
    removeFoodLog(foodLogId: string, mealId: string): Promise<void>;
};
export default mealService;
//# sourceMappingURL=mealService.d.ts.map