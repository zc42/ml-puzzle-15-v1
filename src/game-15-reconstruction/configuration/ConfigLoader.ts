import { FileLoader } from '../utils/FileLoader';
import { EntryPoint } from '../qtable/EntryPoint';
import { JsonUpdateStatus } from '../utils/JsonEditor';

export interface Configuration {
    info?: string,
    //todo: kai pakeiti i true ir paleidi training'a naudoja getOriginalLessonParams 
    //pataisyt/permastyt ... nes ten biski briedas .. visai gal atsisakyt ..?.. ;/
    usePretrainedDataWhileTesting?: boolean,
    useLessonsWhileTraining?: string,
    trainerConfiguration?: TrainerConfiguration
    allLessons?: Lessons[];
}


//todo: kai pakeiti 
export interface TrainerConfiguration {
    learningRate: number,
    discount: number,

    lessonsId: string,
    trainingBatchCount: number,
    lessonsToGenerate: number
}

export interface Lessons {
    id: string;
    lessons: LessonParams[];
}

export interface LessonParams {
    goals: number[];
    startPositions?: number[];
    lessonsToGenerate?: number;
}

export class ConfigurationLoader {

    private static configurationJson: string;
    private static configuration: Configuration;

    public static async getConfiguration(): Promise<Configuration> {
        if (this.configuration !== undefined) return this.configuration;
        let jsonString = await this.getConfigurationJson();
        try {
            return this.configuration = JSON.parse(jsonString);
        } catch (error) {
            console.error("Invalid JSON string:", error);
            return this.configuration = {};
        }
    }

    public static async getConfigurationJson(): Promise<string> {
        if (this.configurationJson !== undefined) return this.configurationJson;
        const path1 = 'dist/configuration.json';
        const path2 = '/public/configuration.json';
        this.configurationJson = await FileLoader.getFile(path1);
        return this.configurationJson === ''
            ? await FileLoader.getFile(path2)
            : this.configurationJson;
    }

    public static async updateConfigurationJson(jsonString: string): Promise<JsonUpdateStatus> {
        try {
            let configuration: Configuration = JSON.parse(jsonString);
            this.configurationJson = jsonString;
            this.configuration = configuration;

        } catch (error) {
            console.error('Invalid JSON string:', error);
            return {
                success: false,
                messgae: 'Invalid JSON string: ' + error
            };
        }

        try {
            await EntryPoint.restartTesterIfIsRunning();
            await EntryPoint.restartTrainerIfIsRunning();
        } catch (error) {
            console.error('error occured restarting tester or traner');
            console.error(error);
        }

        return {
            success: true,
            messgae: 'Configuration updated successfully.'
        };
    }

    public static getOriginalLessonParams(): LessonParams[] {
        return [
            { "goals": [1, 2] },
            { "goals": [3, 4] },
            { "goals": [5, 6] },
            { "goals": [7, 8] },
            { "goals": [9, 13] },
            { "goals": [10, 11, 14, 15] },
            { "goals": [12] }
        ];
    }

}