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
        if (consoleDiv) {
            console.log('clearScreen');
            consoleDiv.innerHTML = '';
        }
    }

    public static prntTestStep(text: string) {
        this.addElementToConsoleDiv('testGameStep', text);
    }

    public static prntTestState(state: string) {
        this.addElementToConsoleDiv('testGameState', state);
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

    public static testPrint() {
        // Example usage of the printToUtils.prnt function
        this.prnt("Hello, World!");
        this.prnt("Error: Something went wrong!", "color: red;");
        this.prnt("Info: This is some information.", "color: #00ff00;");
        this.prnt("Warning: Be careful!", "color: orange;");
    }
}

