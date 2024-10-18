import { CodeJar } from 'codejar';
import { highlight, languages } from 'prismjs';
import { LessonsLoader } from './LessonsLoader';

export class LessonsEditor {

    public static async toggleLessonsDisplay(show: boolean): Promise<void> {
        const tools = document.getElementById('tools');
        if (show && tools) {
            const jsonContent = await LessonsLoader.getLessonsJson();

            const lessonsUpdateStatusDiv = document.createElement('div');
            const lessonsDiv = document.createElement('div');

            tools.appendChild(lessonsUpdateStatusDiv);
            tools.appendChild(lessonsDiv);

            lessonsUpdateStatusDiv.id = 'lessonsUpdateStatus';
            lessonsDiv.id = 'lessons';

            lessonsUpdateStatusDiv.setAttribute('class', 'console-text');


            const jar = CodeJar(lessonsDiv, e => this.update(jsonContent, e, lessonsUpdateStatusDiv));
            jar.updateCode(jsonContent);

        } else {
            document.getElementById('lessonsUpdateStatus')?.remove();
            document.getElementById('lessons')?.remove();
        }
    }

    private static update(jsonContent: string, jsonElement: HTMLElement, updateStatusDiv: HTMLElement): void {
        if (jsonElement.textContent === null) return;

        let newJsonContent = jsonElement.textContent;
        jsonElement.innerHTML = highlight(newJsonContent, languages.js, 'js');

        if (newJsonContent === jsonContent) return;

        let updateResult = LessonsLoader.updateLessonsJson(newJsonContent);
        updateStatusDiv.textContent = updateResult.messgae;
    }
}
