import { LessonsLoader } from '../LessonsLoader';
import { CodeJar } from 'codejar';
import { highlight, languages } from 'prismjs';

export class LessonsEditor {

    public static async toggleLessonsDisplay(show: boolean): Promise<void> {
        const tools = document.getElementById('tools');
        if (show && tools) {
            const jsonContent = await LessonsLoader.getLessonsJson();
            const lessonsDiv = document.createElement('div');
            tools.appendChild(lessonsDiv);
            lessonsDiv.id = 'lessons';

            const jar = CodeJar(lessonsDiv, e => {
                if (e.textContent === null) return;
                e.innerHTML = highlight(e.textContent, languages.js, 'js');
            });

            jar.updateCode(jsonContent);

        } else {
            document.getElementById('lessons')?.remove();
        }
    }
}
