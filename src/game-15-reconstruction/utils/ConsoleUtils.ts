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

    public static clearScreen() {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) consoleDiv.innerHTML = '';
    }

    public static prntTestStep(text: string) {
        this.addElementToConsoleDiv('testGameStep', text);
    }

    public static prntAtSomeElement(elementId: string, textContent: string) {
        this.addElementToConsoleDiv(elementId, textContent);
    }

    public static prntAbout(message: string) {
        const element = document.getElementById('about');
        if (element) element.textContent = '\n' + message;
        else this.prnt(message, 'color:#8d7979', 'about', 'tools', 'stats-info');
    }

    public static clearAbout() {
        document.getElementById('about')?.remove();
    }

    public static prntStatsInfo(message: string) {
        message = message.toLowerCase().replace(", ", " | ");
        this.prntAtStatsInfoElement(message, 'console-error-msg');
    }

    public static prntErrorMsg(message: string) {
        this.prntAtStatsInfoElement(message, 'console-error-msg');
    }

    //todo: perdaryti sita reikes
    private static prntAtStatsInfoElement(message: string, elementClass: string) {
        if (GameUtils.zenGardenOn) return;
        const element = document.getElementById('statsInfo');
        if (!element) return;
        element.setAttribute('class', elementClass);
        element.textContent = '\n' + message;
    }

    private static addElementToConsoleDiv(id: string, text: string) {
        const elementDiv = document.getElementById(id);
        if (!elementDiv) this.prnt(text, 'color:black;', id)
        else elementDiv.innerHTML = text;
    }

    public static prnt(
        message: string,
        style: string = "color:black;",
        elementId: string | null = null,
        parentElementId: string = 'console',
        elementClass: string | null = null): void {

        const consoleDiv = document.getElementById(parentElementId);

        if (!consoleDiv) return
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;

        if (style) messageElement.style.cssText = style;
        if (elementId !== null) messageElement.id = elementId;
        if (elementClass !== null) messageElement.setAttribute('class', elementClass);

        consoleDiv.appendChild(messageElement);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;

    }

    public static warn(message: string) {
        this.prnt(message, "color: orange;");
    }
}

