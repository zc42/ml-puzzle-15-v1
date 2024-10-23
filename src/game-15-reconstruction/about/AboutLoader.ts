import { highlight, languages } from 'prismjs';
import { FileLoader } from '../utils/FileLoader';
import { ConsoleUtils } from '../utils/ConsoleUtils';

export class AboutLoader {

    private static aboutContent: string | null = null;
    public static async toggleDisplay(show: boolean,): Promise<void> {

        if (show) {
            let aboutContent = await this.getAboutContent();
            ConsoleUtils.prntAbout(aboutContent);
        } else {
            ConsoleUtils.clearAbout();
        }
    }

    private static addBr(x: string): string {
        let x1: string[] = JSON.parse(x);
        return x1.reduce((a, b) => a + '<br/>' + b) ?? '';
    }

    private static async getAboutContent(): Promise<string> {
        if (this.aboutContent !== null) return this.aboutContent;

        const fileNames = [
            'about_project.json',
            'about_config_1.json',
            'about_config_example.json',
            'about_config_2.json',
            'about_theory.json',
        ].map(e => 'dist/about/' + e);

        let aaa = fileNames.map(async e => await FileLoader.getFile(e));

        let bb = await Promise.all(aaa);
        console.log(bb);

        const content = [
            this.addBr(await FileLoader.getFile(fileNames[0])),
            this.addBr(await FileLoader.getFile(fileNames[1])),
            highlight(await FileLoader.getFile(fileNames[2]), languages.js, 'js'),
            this.addBr(await FileLoader.getFile(fileNames[3])),
            this.addBr(await FileLoader.getFile(fileNames[4])),
        ].reduce((a, b) => a + '\n' + b);

        return this.aboutContent = content;
    }

    public static show(jsonContent: string): string {
        return highlight(jsonContent, languages.js, 'js');
    }
}