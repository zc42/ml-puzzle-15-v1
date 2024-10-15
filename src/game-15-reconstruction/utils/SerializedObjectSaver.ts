// utils/SerializedObjectSaver.ts
// import * as fs from 'fs';
// import * as path from 'path';
import { Utils } from './Utils'; // Assuming Utils has a similar prnt method

export class SerializedObjectSaver {
    
    // private static _save<T>(filePath: string, obj: T): void {
    //     Utils.prnt(filePath);
    //     Utils.prnt(obj);
        // const fileName = path.resolve(filePath); // Get the absolute path
        
        // try {
        //     const jsonData = JSON.stringify(obj); // Convert object to JSON string
        //     fs.writeFileSync(fileName, jsonData); // Write JSON to file
        // } catch (error) {
        //     Utils.prnt(error.message); // Handle error, print the message
        //     throw error; // Rethrow the error for further handling
        // }
    // }

    public static save<T>(filePath: string, object: T): void {
        Utils.prnt(filePath);
        Utils.prnt(object);
        // const dirPath = path.dirname(filePath); // Get the directory of the file path
        // try {
        //     // Create directories if they do not exist
        //     if (!fs.existsSync(dirPath)) {
        //         fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively
        //     }
        //     this._save(filePath, object); // Call the save function
        // } catch (error) {
        //     Utils.prnt((error as Error).message); // Print the error message
        //     throw error; // Rethrow the error
        // }
    }

    // public static getFilePath(relativePath: string): string {

    //     // return path.resolve('', relativePath); // Resolve to absolute path
    // }
}
