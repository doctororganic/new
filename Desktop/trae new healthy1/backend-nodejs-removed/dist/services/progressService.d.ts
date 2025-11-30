export interface CreateWeightInput {
    userId: string;
    weight: number;
    bodyFat?: number;
    muscle?: number;
    notes?: string;
    recordDate: Date;
}
export interface CreateMeasurementInput {
    userId: string;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    calves?: number;
    neck?: number;
    shoulders?: number;
    forearms?: number;
    wrist?: number;
    bodyFatCaliper?: number;
    notes?: string;
    measurementDate: Date;
}
export declare const progressService: {
    listWeights(userId: string, from?: Date, to?: Date): Promise<any>;
    addWeight(input: CreateWeightInput): Promise<any>;
    deleteWeight(userId: string, id: string): Promise<any>;
    listMeasurements(userId: string, from?: Date, to?: Date): Promise<any>;
    addMeasurement(input: CreateMeasurementInput): Promise<any>;
    deleteMeasurement(userId: string, id: string): Promise<any>;
};
export default progressService;
//# sourceMappingURL=progressService.d.ts.map