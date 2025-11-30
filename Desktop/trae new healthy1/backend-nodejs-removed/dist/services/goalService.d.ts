import { ActivityLevel, GoalType } from '@prisma/client';
export interface CreateGoalInput {
    userId: string;
    name: string;
    description?: string;
    goalType: GoalType;
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    targetFiber?: number;
    targetWater?: number;
    activityLevel: ActivityLevel;
    startDate: Date;
    targetDate?: Date;
}
export interface UpdateGoalInput extends Partial<CreateGoalInput> {
    isActive?: boolean;
    isCompleted?: boolean;
}
export declare const goalService: {
    list(userId: string): Promise<any>;
    active(userId: string): Promise<any>;
    create(input: CreateGoalInput): Promise<any>;
    update(id: string, userId: string, input: UpdateGoalInput): Promise<any>;
    remove(id: string, userId: string): Promise<any>;
};
export default goalService;
//# sourceMappingURL=goalService.d.ts.map