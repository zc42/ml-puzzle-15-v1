import { TrainingConfigLoader } from './TrainingConfigLoader';
import { JsonEditor } from '../utils/JsonEditor';

export class LessonsEditor {

    public static async toggleLessonsDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await TrainingConfigLoader.getLessonsJson();
            let updateJsonFn = async (jsonContent: string) => TrainingConfigLoader.updateLessonsJson(jsonContent)
            await JsonEditor.show(jsonContent, updateJsonFn);
        } else {
            JsonEditor.close();
        }
    }
}
