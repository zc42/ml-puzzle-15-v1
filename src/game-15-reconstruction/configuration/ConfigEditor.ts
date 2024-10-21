import { ConfigurationLoader } from './ConfigLoader';
import { JsonEditor } from '../utils/JsonEditor';

export class LessonsEditor {

    public static async toggleLessonsDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await ConfigurationLoader.getConfigurationJson();
            let updateJsonFn = async (jsonContent: string) => ConfigurationLoader.updateConfigurationJson(jsonContent)
            await JsonEditor.show(jsonContent, updateJsonFn);
        } else {
            JsonEditor.close();
        }
    }
}
