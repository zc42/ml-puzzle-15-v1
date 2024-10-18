import { FileLoader } from '../utils/FileLoader';

export interface Lesson {
    lesson: number;
    goals: number[];
    lockedElements?: number[];
    freeCellStartingPositions?: number[];
    lessonsToGenerate?: number;
}

export interface LessonsUpdateStatus {
    updated: boolean;
    messgae: string;
}

export class LessonsLoader {

    private static lessonsJson: string;
    private static lessons: Lesson[];

    public static async getLessons(): Promise<Lesson[]> {
        if (this.lessons !== undefined) return this.lessons;
        let jsonString = await this.getLessonsJson();
        console.log('lessons loaded')
        try {
            this.lessons = JSON.parse(jsonString);
            this.lessons.sort((o1, o2) => o1.lesson - o2.lesson);
            return this.lessons;
        } catch (error) {
            console.error("Invalid JSON string:", error);
            return this.lessons = [];
        }
    }

    public static async getLessonsJson(): Promise<string> {
        if (this.lessonsJson !== undefined) return this.lessonsJson;
        const path1 = 'dist/lessons_0.json';
        const path2 = '/public/lessons_0.json';
        this.lessonsJson = await FileLoader.getFile(path1);
        return this.lessonsJson === ''
            ? await FileLoader.getFile(path2)
            : this.lessonsJson;
    }

    public static updateLessonsJson(jsonString: string): LessonsUpdateStatus {
        try {
            let lessons: Lesson[] = JSON.parse(jsonString);
            lessons.sort((o1, o2) => o1.lesson - o2.lesson);
            this.lessonsJson = jsonString;
            this.lessons = lessons;

            return {
                updated: true,
                messgae: 'Lessons updated successfully.'
            };

        } catch (error) {
            console.error('Invalid JSON string:', error);
            return {
                updated: false,
                messgae: 'Invalid JSON string: ' + error
            };

        }
    }
}