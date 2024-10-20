import { GameUtils } from "../environment/GameUtils";

export class ConsoleUtils {

    public static blue(text: string): string {
        return '<span style="color: blue;">' + text + '</span>'; // Blue text
    }

    public static green(text: string): string {
        return '<span style="color: green;">' + text + '</span>'; // Green text
    }

    public static red(text: string): string {
        return '<span style="color: red;">' + text + '</span>'; // Color by red
    }

    public static clearScreenX() {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) consoleDiv.innerHTML = '';
    }

    public static prntTestStep(text: string) {
        this.addElementToConsoleDiv('testGameStep', text);
    }

    public static prntAtSomeElement(elementId: string, textContent: string) {
        this.addElementToConsoleDiv(elementId, textContent);
    }

    public static prntStatsInfo(message: string) {
        const element = document.getElementById('statsInfo');
        if (!element) return;
        element.setAttribute('class', "console-text");
        element.textContent = '\n' + message.toLowerCase().replace(", ", " | ");
    }

    public static prntErrorMsg(message: string) {
        if (GameUtils.zenGardenOn) return;
        const element = document.getElementById('statsInfo');
        if (!element) return;
        element.setAttribute('class', "console-error-msg");
        element.textContent = '\n' + message;
    }

    private static addElementToConsoleDiv(id: string, text: string) {
        const elementDiv = document.getElementById(id);
        if (!elementDiv) this.prnt(text, 'color:black;', id)
        else elementDiv.innerHTML = text;
    }

    public static prnt(message: string, style: string = "color:black;", elementId: string | null = null): void {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = message;

            if (style) messageElement.style.cssText = style;
            if (elementId !== null) messageElement.id = elementId;

            consoleDiv.appendChild(messageElement);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
    }

    public static warn(message: string) {
        this.prnt(message, "color: orange;");
    }
}

