import { LessonsLoader } from './LessonsLoader';
import { JsonEditor } from '../utils/JsonEditor';

export class LessonsEditor {

    public static async toggleDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await LessonsLoader.getLessonsConfigurationJson();
            let updateJsonFn = async (jsonContent: string) => LessonsLoader.updateLessonsConfigurationJson(jsonContent)
            await JsonEditor.show(jsonContent, updateJsonFn);
        } else {
            JsonEditor.close();
        }
    }
}
