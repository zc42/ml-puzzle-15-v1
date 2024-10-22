import { StateShuffle } from './StateShuffle';
import { ConfigurationLoader } from '../configuration/ConfigLoader';
import { LessonParams, LessonsLoader } from '../lessons/LessonsLoader';
import { ConsoleUtils } from '../utils/ConsoleUtils';

export class LessonProducer {
    private boardState: number[];
    private episodesToTrain: number;
    private lesson: LessonParams;
    private lockedElements: number[];

    public static readonly stateDone: number[] = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, -1
    ];

    private constructor(lesson: LessonParams, lockedElements: number[]) {
        this.boardState = [];
        this.lesson = lesson;
        this.episodesToTrain = 0;
        this.lockedElements = lockedElements;
    }

    public getState() {
        return this.boardState;
    }

    public getGoals() {
        return this.lesson.goals;
    }

    public getLockedStateElements(): number[] {
        return this.lockedElements;
    }

    public getEpisodesToTrain() {
        return this.episodesToTrain;
    }

    public static async getLessonProducersFromJson(): Promise<LessonProducer[]> {
        let config = await ConfigurationLoader.getConfiguration();
        let lessonsConfig = await LessonsLoader.getLessonsConfiguration();
        const trainerConfiguration = config.trainerConfiguration;

        if (trainerConfiguration?.lessonsId === undefined) {
            ConsoleUtils.prntErrorMsg('trainerConfiguration?.lessonsId === undefined')
            throw new Error('trainerConfiguration?.lessonsId === undefined');
        }

        let lessonsId = undefined;
        let lessons: LessonParams[] | null = null;
        
        if (config.usePretrainedDataWhileTesting === true) {
            lessons = LessonsLoader.getOriginalLessonParams();
        } else {
            let lessonsId = trainerConfiguration?.lessonsId ?? '';
            lessons = lessonsConfig.allLessons?.find(e => e.id === lessonsId)?.lessons ?? null;
        }

        if (lessons === null) {
            ConsoleUtils.prntErrorMsg('no lessons found for lessonsId: \'' + lessonsId + '\'')
            throw new Error('lessons === null');
        }

        const defaultEpisdeCount = trainerConfiguration?.lessonsToGenerate ?? 100;
        return lessons
            .map((e, i0) => {
                let fixedElements = lessons.filter((_, i1) => i1 < i0).flatMap(e => e.goals) ?? [];
                return LessonProducer.from(e, fixedElements, defaultEpisdeCount);
            });
    }

    private static from(lessonParams: LessonParams, fixedElements: number[], defaultEpisdeCount: number): LessonProducer {
        const lessonProducer = new LessonProducer(lessonParams, fixedElements);
        lessonProducer.lesson = lessonParams;
        lessonProducer.episodesToTrain = lessonParams.lessonsToGenerate !== undefined
            ? lessonParams.lessonsToGenerate
            : defaultEpisdeCount;

        lessonProducer.shuffleBoardState();
        return lessonProducer;
    }

    public isLockedIndex(index: number): boolean {
        return this.getLockedStateElements().includes(index + 1);
    }

    public shuffleBoardState(): void {
        const lockedElements = this.getLockedStateElements();
        this.boardState = StateShuffle.shuffleForTraining(lockedElements);
        // if (this.lesson?.startPositions === undefined) return;
        // LessonProducer.shuffleFreeCellStarPosition(this, this.lesson.startPositions.map(e => e - 1));
    }
}
