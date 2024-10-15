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
        this.prnt("clearScrn ... ", "color: orange;");
    }

    public static prnt(message: string, style: string = ""): void {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) {
            // Create a new div element for each message
            const messageElement = document.createElement('div');
            messageElement.textContent = message;

            // Apply custom styles if provided
            if (style) {
                messageElement.style.cssText = style;
            }

            // Append the message to the custom Utils.prnt
            consoleDiv.appendChild(messageElement);

            // Scroll to the bottom of the Utils.prnt to show the latest message
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

