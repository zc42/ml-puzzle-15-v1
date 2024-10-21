import { CodeJar } from 'codejar';
import { highlight, languages } from 'prismjs';

export interface JsonUpdateStatus {
    success: boolean;
    messgae: string;
}

export class JsonEditor {

    private static divLine: string = '--------------------------------------------------------------------------------------------------';

    public static close(): void {
        document.getElementById('jsonEditor')?.remove();
    }

    public static show(
        jsonContent: string,
        updateJsonFn: (jsonContent: string) => Promise<JsonUpdateStatus>,
        editable: boolean = true
    ): void {

        const toolsDiv = document.getElementById('tools');
        if (!toolsDiv) return;

        //remove preveios jsonEditor div, if there is one
        document.getElementById('jsonEditor')?.remove();

        const editorDiv = document.createElement('div');

        const beginLineDiv = document.createElement('div');
        const endLineDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        const statusDiv = document.createElement('div');

        toolsDiv.appendChild(editorDiv);
        //--------------------------------------
        editorDiv.appendChild(beginLineDiv);
        editorDiv.appendChild(statusDiv);
        editorDiv.appendChild(contentDiv);
        editorDiv.appendChild(endLineDiv);
        //--------------------------------------

        editorDiv.id = 'jsonEditor';
        statusDiv.setAttribute('class', 'console-text');
        beginLineDiv.textContent = this.divLine;
        endLineDiv.textContent = this.divLine;

        const fn = async (jsonElement: HTMLElement) => this.update(jsonContent, jsonElement, statusDiv, updateJsonFn, editable)
        const codeJar = CodeJar(contentDiv, fn);
        codeJar.updateCode(jsonContent);
    }

    private static async update(
        jsonContent: string,
        jsonElement: HTMLElement,
        updateStatusDiv: HTMLElement,
        updateJsonFn: (jsonContent: string) => Promise<JsonUpdateStatus>,
        editable: boolean
    ): Promise<void> {
        if (jsonElement.textContent === null) return;

        let newJsonContent = editable ? jsonElement.textContent : jsonContent;
        jsonElement.innerHTML = highlight(newJsonContent, languages.js, 'js');

        if (newJsonContent === jsonContent) return;

        let updateResult = await updateJsonFn(newJsonContent);
        updateStatusDiv.textContent = updateResult.messgae;
    }
}
