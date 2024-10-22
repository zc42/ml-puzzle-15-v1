import { StateShuffle } from './StateShuffle';
import { Lesson, ConfigurationLoader } from '../configuration/ConfigLoader';

export class LessonProducer {
    private boardState: number[];
    private episodesToTrain: number;
    private lesson: Lesson;
    private lockedElements: number[];

    public static readonly stateDone: number[] = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, -1
    ];

    private constructor(lesson: Lesson, lockedElements: number[]) {
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
        if (config.lessons === undefined) return [];
        const defaultEpisdeCount = config.basicTrainerConfig?.lessonsToGenerate ?? 100;
        let lessons = config.lessons;
        return config.lessons
            .map((e, i0) => {
                let fixedElements = lessons.filter((_, i1) => i1 < i0).flatMap(e => e.goals) ?? [];
                return LessonProducer.from(e, fixedElements, defaultEpisdeCount);
            });
    }

    private static from(lesson: Lesson, fixedElements: number[], defaultEpisdeCount: number): LessonProducer {
        const lessonProducer = new LessonProducer(lesson, fixedElements);
        lessonProducer.lesson = lesson;
        lessonProducer.episodesToTrain = lesson.lessonsToGenerate !== undefined
            ? lesson.lessonsToGenerate
            : defaultEpisdeCount;

        lessonProducer.shuffleBoardState();
        return lessonProducer;
    }

    // private static shuffleFreeCellStarPosition(stateProducer: LessonProducer, availableFreeCellIndexes: number[]): LessonProducer {
    //     const newFreeCellIndex = Utils.shuffleArray(availableFreeCellIndexes)[0]
    //     const oldFreeCellIndex = stateProducer.boardState.indexOf(-1);
    //     const v = stateProducer.boardState[newFreeCellIndex];
    //     stateProducer.boardState[newFreeCellIndex] = -1;
    //     stateProducer.boardState[oldFreeCellIndex] = v;
    //     return stateProducer;
    // }

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
