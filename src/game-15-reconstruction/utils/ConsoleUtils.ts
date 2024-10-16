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
        if (consoleDiv) { consoleDiv.innerHTML = ''; }
    }

    // public static _prnt(message: string, style: string = ""): void {
    //     this.prntBase(message, style, 'span');
    // }

    public static prnt(message: string, style: string = "color:black;"): void {
        this.prntBase(message, style);
    }

    private static prntBase(message: string, style: string = "", docElement: string = "div"): void {
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) {
            const messageElement = document.createElement(docElement);
            messageElement.innerHTML = "<div>" + message + "</div>";
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

