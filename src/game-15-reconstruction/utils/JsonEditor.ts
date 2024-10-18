import { CodeJar } from 'codejar';
import { highlight, languages } from 'prismjs';

export interface JsonUpdateStatus {
    success: boolean;
    messgae: string;
}

export class JsonEditor {

    private static divLine: string = '--------------------------------------------------------------------------------------------------';

    // public static toggleJsonEditor(
    //     show: boolean,
    //     getJsonFn: () => string,
    //     updateJsonFn: (jsonContent: string) => JsonUpdateStatus
    // ): void {
    //     if (show) this.show(getJsonFn, updateJsonFn);
    //     else document.getElementById('jsonEditor')?.remove();
    // }

    public static close(): void {
        document.getElementById('jsonEditor')?.remove();
    }

    public static show(
        jsonContent: string,
        updateJsonFn: (jsonContent: string) => JsonUpdateStatus
    ): void {

        const toolsDiv = document.getElementById('tools');
        if (!toolsDiv) return;

        // const jsonContent = getJsonFn();
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
        // contentDiv.setAttribute('class', 'editor');
        statusDiv.setAttribute('class', 'console-text');
        beginLineDiv.textContent = this.divLine;
        endLineDiv.textContent = this.divLine;

        const codeJar = CodeJar(contentDiv, e => this.update(jsonContent, e, statusDiv, updateJsonFn));
        codeJar.updateCode(jsonContent);
    }

    private static update(
        jsonContent: string,
        jsonElement: HTMLElement,
        updateStatusDiv: HTMLElement,
        updateJsonFn: (jsonContent: string) => JsonUpdateStatus
    ): void {
        if (jsonElement.textContent === null) return;

        let newJsonContent = jsonElement.textContent;
        jsonElement.innerHTML = highlight(newJsonContent, languages.js, 'js');

        if (newJsonContent === jsonContent) return;

        let updateResult = updateJsonFn(newJsonContent);
        updateStatusDiv.textContent = updateResult.messgae;
    }
}
