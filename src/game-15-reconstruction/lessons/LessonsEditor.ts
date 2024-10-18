import { LessonsLoader } from './LessonsLoader';
import { JsonEditor } from '../utils/JsonEditor';

export class LessonsEditor {

    public static async toggleLessonsDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await LessonsLoader.getLessonsJson();
            let updateJsonFn = (jsonContent: string) => LessonsLoader.updateLessonsJson(jsonContent)
            JsonEditor.show(jsonContent, updateJsonFn);
        } else {
            JsonEditor.close();
        }
    }
}
