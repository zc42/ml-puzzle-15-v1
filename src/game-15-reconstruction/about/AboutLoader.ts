import { FileLoader } from '../utils/FileLoader';
import { JsonEditor, JsonUpdateStatus } from '../utils/JsonEditor';

export class AboutLoader {

    private static aboutJson: string;
    private static about: string[];
    private static updateStatus: JsonUpdateStatus = { "success": false, 'messgae': 'Not editable.' };


    public static async toggleConfigurationDisplay(show: boolean,): Promise<void> {
        if (show) {
            const jsonContent = await AboutLoader.getAboutJson();
            JsonEditor.show(jsonContent, async _ => AboutLoader.updateStatus, false);
        } else {
            JsonEditor.close();
        }
    }

    public static async getAbout(): Promise<string[]> {
        if (this.about !== undefined) return this.about;
        let jsonString = await this.getAboutJson();
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            const errorMsg = 'Invalid JSON string: ' + error;
            console.error(errorMsg);
            return this.about = [];
        }
    }

    public static async getAboutJson(): Promise<string> {
        if (this.aboutJson !== undefined) return this.aboutJson;
        const path1 = 'dist/about.json';
        const path2 = '/public/about.json';
        this.aboutJson = await FileLoader.getFile(path1);
        return this.aboutJson === ''
            ? await FileLoader.getFile(path2)
            : this.aboutJson;
    }
}