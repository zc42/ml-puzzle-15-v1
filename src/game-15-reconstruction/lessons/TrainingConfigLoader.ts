import { FileLoader } from '../utils/FileLoader';
import { JsonUpdateStatus } from '../utils/JsonEditor';

export interface TrainingConfig {
    help?: string,
    basicTrainerConfig?: BasicTrainerConfig
    lessons?: Lesson[];
}

export interface BasicTrainerConfig {
    learningRate: number,
    discount: number,
    trainingBachCount: number,
    lessonsToGenerate: number
}

export interface Lesson {
    lesson: number;
    goals: number[];
    lockedElements?: number[];
    startPositions?: number[];
    lessonsToGenerate?: number;
}

export class TrainingConfigLoader {

    private static trainingConfigJson: string;
    private static trainingConfig: TrainingConfig;

    public static async getTraningConfiguration(): Promise<TrainingConfig> {
        if (this.trainingConfig !== undefined) return this.trainingConfig;
        let jsonString = await this.getLessonsJson();
        try {
            this.trainingConfig = JSON.parse(jsonString);
            this.trainingConfig.lessons = this.trainingConfig.lessons?.sort((o1, o2) => o1.lesson - o2.lesson);
            return this.trainingConfig;
        } catch (error) {
            console.error("Invalid JSON string:", error);
            return this.trainingConfig = {};
        }
    }

    public static async getLessonsJson(): Promise<string> {
        if (this.trainingConfigJson !== undefined) return this.trainingConfigJson;
        const path1 = 'dist/trainingConfig.json';
        const path2 = '/public/trainingConfig.json';
        this.trainingConfigJson = await FileLoader.getFile(path1);
        return this.trainingConfigJson === ''
            ? await FileLoader.getFile(path2)
            : this.trainingConfigJson;
    }

    public static updateLessonsJson(jsonString: string): JsonUpdateStatus {
        try {
            let trainingConfig: TrainingConfig = JSON.parse(jsonString);
            this.trainingConfig.lessons = this.trainingConfig.lessons?.sort((o1, o2) => o1.lesson - o2.lesson);
            this.trainingConfigJson = jsonString;
            this.trainingConfig = trainingConfig;

            return {
                success: true,
                messgae: 'Training config updated successfully.'
            };

        } catch (error) {
            console.error('Invalid JSON string:', error);
            return {
                success: false,
                messgae: 'Invalid JSON string: ' + error
            };

        }
    }
}