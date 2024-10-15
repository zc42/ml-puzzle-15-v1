// utils/SerializedObjectLoader.ts
// import * as fs from 'fs/promises'; // Import fs from fs/promises for promise-based I/O
// import * as path from 'path';
import { Utils } from './Utils'; // Assuming Utils has a similar prnt method

export class SerializedObjectLoader {
    
    public static async load(filePath: string) {
        // const absolutePath = path.resolve(filePath); // Get the absolute path
        Utils.prnt(filePath);
    }

    // private static async _load<T>(filePath: string): Promise<T> {
    //     try {
    //         const data = await fs.readFile(filePath, 'utf-8'); // Read the file asynchronously
    //         const obj = JSON.parse(data); // Parse the JSON string into an object
    //         return obj; // Return the loaded object
    //     } catch (error) {
    //         Utils.prnt((error as Error).message); // Print the error message
    //         throw error; // Rethrow the error
    //     }
    // }

    // public static async loadFrom<T>(filePath: string): Promise<T | null> {
    //     try {
    //         return await this.load<T>(filePath); // Try loading the object
    //     } catch (error) {
    //         Utils.prnt((error as Error).message); // Print the error message
    //         return null; // Return null on error
    //     }
    // }
}
