import { Utils } from '../utils/Utils';
import { StateShuffle } from './StateShuffle';
import { Lesson, ConfigurationLoader } from '../configuration/ConfigLoader';

export class LessonProducer {
    private boardState: number[];
    private episodesToTrain: number;
    private lesson: Lesson;

    public static readonly stateDone: number[] = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, -1
    ];

    private constructor(lesson: Lesson) {
        this.boardState = [];
        this.lesson = lesson;
        this.episodesToTrain = 0;
    }

    public getState() {
        return this.boardState;
    }

    public getGoals() {
        return this.lesson.goals;
    }

    public getLockedStateElements(): number[] {
        return this.lesson.lockedElements ?? [];
    }

    public getEpisodesToTrain() {
        return this.episodesToTrain;
    }

    public static async getLessonProducersFromJson(): Promise<LessonProducer[]> {
        let config = await ConfigurationLoader.getConfiguration();
        if (config.lessons === undefined) return [];
        const defaultEpisdeCount = config.basicTrainerConfig?.lessonsToGenerate ?? 100;
        return config.lessons
            .sort((o1, o2) => o1.lesson - o2.lesson)
            .map(e => LessonProducer.from(e, defaultEpisdeCount));
    }

    private static from(lesson: Lesson, defaultEpisdeCount: number): LessonProducer {
        const lessonProducer = new LessonProducer(lesson);
        lessonProducer.lesson = lesson;
        lessonProducer.episodesToTrain = lesson.lessonsToGenerate !== undefined
            ? lesson.lessonsToGenerate
            : defaultEpisdeCount;

        lessonProducer.shuffleBoardState();
        return lessonProducer;
    }

    private static shuffleFreeCellStarPosition(stateProducer: LessonProducer, availableFreeCellIndexes: number[]): LessonProducer {
        const newFreeCellIndex = Utils.shuffleArray(availableFreeCellIndexes)[0]
        const oldFreeCellIndex = stateProducer.boardState.indexOf(-1);
        const v = stateProducer.boardState[newFreeCellIndex];
        stateProducer.boardState[newFreeCellIndex] = -1;
        stateProducer.boardState[oldFreeCellIndex] = v;
        return stateProducer;
    }

    public isLockedIndex(index: number): boolean {
        return this.getLockedStateElements().includes(index + 1);
    }

    public shuffleBoardState(): void {
        const lockedElements = this.getLockedStateElements();
        this.boardState = StateShuffle.shuffleForTraining(lockedElements);
        if (this.lesson?.startPositions === undefined) return;
        LessonProducer.shuffleFreeCellStarPosition(this, this.lesson.startPositions.map(e => e - 1));
    }
}
