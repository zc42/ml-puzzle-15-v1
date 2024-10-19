import { Tester } from '../qtable/Tester';
import { FileLoader } from '../utils/FileLoader';
import { EntryPoint } from '../qtable/EntryPoint';
import { JsonUpdateStatus } from '../utils/JsonEditor';

export interface Config {
    version?: string;
    use_pretrained_data_while_testing: boolean,
    info?: string[]
}


export class ConfigLoader {

    private static configJson: string;
    private static config: Config;

    public static async getConfig(): Promise<Config> {
        if (this.config !== undefined) return this.config;
        let jsonString = await this.getConfigJson();
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            const errorMsg = 'Invalid JSON string: ' + error;
            console.error(errorMsg);
            return this.config = {
                version: '-1',
                use_pretrained_data_while_testing: true
            };
        }
    }

    public static async getConfigJson(): Promise<string> {
        if (this.configJson !== undefined) return this.configJson;
        const path1 = 'dist/config.json';
        const path2 = '/public/config.json';
        this.configJson = await FileLoader.getFile(path1);
        return this.configJson === ''
            ? await FileLoader.getFile(path2)
            : this.configJson;
    }

    public static async updateConfigJson(jsonString: string): Promise<JsonUpdateStatus> {
        try {
            let config: Config = JSON.parse(jsonString);
            this.configJson = jsonString;
            this.config = config;

            await ConfigLoader.updateTester();

            return {
                success: true,
                messgae: 'Configuration updated successfully. Please toggle the \'test\', \'train\' or other button to apply the changes.'
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
        const usePretrainedData = this.config.use_pretrained_data_while_testing;
        if (Tester.usePreloadedActions === usePretrainedData) return;
        await EntryPoint.restartIfIsRunning();
    }
}