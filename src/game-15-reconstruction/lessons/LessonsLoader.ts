import { FileLoader } from '../utils/FileLoader';
import { EntryPoint } from '../qtable/EntryPoint';
import { JsonUpdateStatus } from '../utils/JsonEditor';

export interface LessonsConfiguration {
    info?: string,
    allLessons?: Lessons[];
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

export class LessonsLoader {

    private static configurationJson: string;
    private static configuration: LessonsConfiguration;

    public static async getLessonsConfiguration(): Promise<LessonsConfiguration> {
        if (this.configuration !== undefined) return this.configuration;
        let jsonString = await this.getLessonsConfigurationJson();
        try {
            this.configuration = JSON.parse(jsonString);
            return this.configuration;
        } catch (error) {
            console.error("Invalid JSON string:", error);
            return this.configuration = {};
        }
    }

    public static async getLessonsConfigurationJson(): Promise<string> {
        if (this.configurationJson !== undefined) return this.configurationJson;
        const path1 = 'dist/lessons.json';
        const path2 = '/public/lessons.json';
        this.configurationJson = await FileLoader.getFile(path1);
        return this.configurationJson === ''
            ? await FileLoader.getFile(path2)
            : this.configurationJson;
    }

    public static async updateLessonsConfigurationJson(jsonString: string): Promise<JsonUpdateStatus> {
        try {
            let configuration: LessonsConfiguration = JSON.parse(jsonString);
            this.configurationJson = jsonString;
            this.configuration = configuration;

            await EntryPoint.restartTesterIfIsRunning();
            await EntryPoint.restartTrainerIfIsRunning();

            return {
                success: true,
                messgae: 'Lessons configuration updated successfully.'
            };

        } catch (error) {
            console.error('Invalid JSON string:', error);
            return {
                success: false,
                messgae: 'Invalid JSON string: ' + error
            };
        }
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