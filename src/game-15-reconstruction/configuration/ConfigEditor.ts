import { ConfigLoader } from './ConfigLoader';
import { JsonEditor } from '../utils/JsonEditor';

export class ConfigEditor {

    public static async toggleConfigurationDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await ConfigLoader.getConfigJson();
            let updateJsonFn = (jsonContent: string) => ConfigLoader.updateLessonsJson(jsonContent)
            JsonEditor.show(jsonContent, updateJsonFn);
        } else {
            JsonEditor.close();
        }
    }
}
