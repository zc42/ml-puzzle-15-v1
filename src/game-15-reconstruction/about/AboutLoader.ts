import { ConsoleUtils } from '../utils/ConsoleUtils';
import { FileLoader } from '../utils/FileLoader';
// import { JsonEditor, JsonUpdateStatus } from '../utils/JsonEditor';

export class AboutLoader {

    private static aboutJson: string;
    private static about: string[];
    // private static updateStatus: JsonUpdateStatus = { "success": false, 'messgae': 'Not editable.' };


    public static async toggleDisplay(show: boolean,): Promise<void> {
        if (show) {
            let about = await this.getAbout();
            let aboutContent = about.reduce((a, b) => a + '<br/>' + b);
            ConsoleUtils.prntAbout(aboutContent);

            // JsonEditor.show(jsonContent, async _ => AboutLoader.updateStatus, false);
        } else {
            ConsoleUtils.clearAbout();
        }
    }

    private static async getAbout(): Promise<string[]> {
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

    private static async getAboutJson(): Promise<string> {
        if (this.aboutJson !== undefined) return this.aboutJson;
        const path1 = 'dist/about.json';
        const path2 = '/public/about.json';
        this.aboutJson = await FileLoader.getFile(path1);
        return this.aboutJson === ''
            ? await FileLoader.getFile(path2)
            : this.aboutJson;
    }
}