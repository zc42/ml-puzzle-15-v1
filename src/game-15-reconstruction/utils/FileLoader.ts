export class FileLoader {

    public static async getFile(filePath: string): Promise<string> {
        let data = '';
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            data = await response.text();
        } catch (error) {
            console.error('Error reading file: ' + filePath, error);
        } finally {
            return data;
        }
    }
}
