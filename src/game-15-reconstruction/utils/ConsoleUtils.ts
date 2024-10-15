export class ConsoleUtils {

    public static blue(text: string): string {
        return `\x1b[34m${text}\x1b[0m`; // Blue text
    }

    public static green(text: string): string {
        return `\x1b[32m${text}\x1b[0m`; // Green text
    }

    public static color(text: string, colorCode: number): string {
        return `\x1b[${colorCode}m${text}\x1b[0m`; // Color by code
    }

    public static clearScreen() {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) { consoleDiv.innerHTML = ''; }
    }

    public static prnt(message: string, style: string = ""): void {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            if (style) {
                messageElement.style.cssText = style;
            }

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

