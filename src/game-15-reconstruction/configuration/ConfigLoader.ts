import { Tester } from '../qtable/Tester';
import { FileLoader } from '../utils/FileLoader';
import { EntryPoint } from '../qtable/EntryPoint';
import { JsonUpdateStatus } from '../utils/JsonEditor';

export interface Configuration {
    info?: string,
    basicTrainerConfig?: BasicTrainerConfiguration
    usePretrainedDataWhileTesting?: boolean
    lessons?: Lesson[];
}

export interface BasicTrainerConfiguration {
    learningRate: number,
    discount: number,
    trainingBachCount: number,
    lessonsToGenerate: number
}

export interface Lesson {
    goals: number[];
    // lockedElements?: number[];
    // startPositions?: number[];
    lessonsToGenerate?: number;
}

export class ConfigurationLoader {

    private static configurationJson: string;
    private static configuration: Configuration;

    public static async getConfiguration(): Promise<Configuration> {
        if (this.configuration !== undefined) return this.configuration;
        let jsonString = await this.getConfigurationJson();
        try {
            this.configuration = JSON.parse(jsonString);
            // this.configuration.lessons = this.configuration.lessons?.sort((o1, o2) => o1.lesson - o2.lesson);
            return this.configuration;
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
            // this.configuration.lessons = this.configuration.lessons?.sort((o1, o2) => o1.lesson - o2.lesson);
            this.configurationJson = jsonString;
            this.configuration = configuration;

            await ConfigurationLoader.updateTester();
            await EntryPoint.restartTrainerIfIsRunning();

            return {
                success: true,
                messgae: 'Configuration updated successfully.'
            };

        } catch (error) {
            console.error('Invalid JSON string:', error);
            return {
                success: false,
                messgae: 'Invalid JSON string: ' + error
            };
        }
    }

    private static async updateTester() {
        const usePretrainedData = this.configuration.usePretrainedDataWhileTesting;
        if (Tester.usePreloadedActions === usePretrainedData) return;
        await EntryPoint.restartTesterIfIsRunning();
    }
}