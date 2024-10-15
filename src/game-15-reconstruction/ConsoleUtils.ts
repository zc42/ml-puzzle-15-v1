// utils/ConsoleUtils.ts
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
        console.log("clearScrn ... ");
    }

    
}