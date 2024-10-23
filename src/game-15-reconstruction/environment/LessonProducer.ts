import { Utils } from '../utils/Utils';
import { StateShuffle } from './StateShuffle';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { ConfigurationLoader, LessonParams, Configuration } from '../configuration/ConfigLoader';

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

    public isLockedIndex(index: number): boolean {
        return this.getLockedStateElements().includes(index + 1);
    }

    public shuffleBoardState(): void {
        const lockedElements = this.getLockedStateElements();
        this.boardState = StateShuffle.shuffleForTraining(lockedElements);
        if (this.lesson?.startPositions === undefined) return;
        LessonProducer.shuffleFreeCellStarPosition(this, this.lesson.startPositions.map(e => e - 1));
    }    

    public static async getLessonProducersFromJson(): Promise<LessonProducer[]> {
        let config = await ConfigurationLoader.getConfiguration();
        let lessons = this.getLessons(config);
        const defaultEpisdeCount = config.trainerConfiguration?.lessonsToGenerate ?? 100;

        return lessons
            .map((e, i) => {
                let fixedElements = this.getFixedElementsForLesson(lessons, e, i);
                return this.from(e, fixedElements, defaultEpisdeCount);
            });
    }

    private static getFixedElementsForLesson(lessons: LessonParams[], lessonParams: LessonParams, index: number) {
        let fixedElements = lessons.filter((_, i1) => i1 < index).flatMap(e => e.goals) ?? [];
        fixedElements = fixedElements.filter(e => !lessonParams.goals.includes(e));
        return fixedElements;
    }

    private static getLessons(config: Configuration) {

        if (config.useLessonsIdWhileTraining === undefined) {
            ConsoleUtils.prntErrorMsg('config.useLessonsIdWhileTraining === undefined');
            throw new Error('config.useLessonsIdWhileTraining === undefined');
        }

        let lessonsId = undefined;
        let lessons: LessonParams[] | null = null;

        if (config.usePretrainedDataWhileTesting === true) {
            lessons = ConfigurationLoader.getOriginalLessonParams();
        } else {
            let lessonsId = config.useLessonsIdWhileTraining ?? '';
            lessons = config.allLessons?.find(e => e.id === lessonsId)?.lessons ?? null;
        }

        if (lessons === null) {
            ConsoleUtils.prntErrorMsg('no lessons found for lessonsId: \'' + lessonsId + '\'');
            throw new Error('lessons === null');
        }
        return lessons;
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

    private static shuffleFreeCellStarPosition(stateProducer: LessonProducer, availableFreeCellIndexes: number[]): LessonProducer {
        const newFreeCellIndex = Utils.shuffleArray(availableFreeCellIndexes)[0]
        const oldFreeCellIndex = stateProducer.boardState.indexOf(-1);
        const v = stateProducer.boardState[newFreeCellIndex];
        stateProducer.boardState[newFreeCellIndex] = -1;
        stateProducer.boardState[oldFreeCellIndex] = v;
        return stateProducer;
    }
}
