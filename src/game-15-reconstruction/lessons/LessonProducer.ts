import { Utils } from '../utils/Utils';
import { StateShuffle } from './StateShuffle';
import { Lesson, LessonsLoader } from './LessonsLoader';

export class LessonProducer {
    private goals: number[];
    private lockedStateElements: number[];
    private state: number[];
    private episodesToTrain: number;
    private readonly lessonNb: number;

    public static readonly stateDone: number[] = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, -1
    ];

    private constructor(lessonNb: number) {
        this.lessonNb = lessonNb;
        this.goals = [];
        this.lockedStateElements = [];
        this.state = [];
        this.episodesToTrain = 0;
    }

    public getState() {
        return this.state;
    }

    public getGoals() {
        return this.goals;
    }

    public getLockedStateElements() {
        return this.lockedStateElements;
    }

    public getEpisodesToTrain() {
        return this.episodesToTrain;
    }

    public static async getLessonProducersFromJson(): Promise<LessonProducer[]> {
        let lessons = await LessonsLoader.getLessons();
        return lessons.map((e, i) => LessonProducer.from(e, i));
    }

    private static from(lesson: Lesson, lessonNb: number): LessonProducer {
        const stateProducer = new LessonProducer(lessonNb);
        stateProducer.goals = lesson.goals;

        stateProducer.lockedStateElements = lesson.lockedElements !== undefined ? lesson.lockedElements : [];
        stateProducer.episodesToTrain = lesson.lessonsToGenerate !== undefined ? lesson.lessonsToGenerate : 100;

        // stateProducer.state = [...LessonProducer.stateDone];
        // LessonProducer.shuffle(stateProducer, stateProducer.lockedStateElements);

        stateProducer.state = StateShuffle.shuffleForTraining(stateProducer.lockedStateElements);

        // stateProducer.state = StateShuffle.shuffle([...LessonProducer.stateDone], stateProducer.lockedStateElements, this.shufleSteps);

        return lesson.startPositions !== undefined
            ? LessonProducer.shuffleFreeCellStarPosition(stateProducer, lesson.startPositions.map(e => e - 1))
            : stateProducer;
    }

    public static generateLessons0(): LessonProducer[] {
        return [
            LessonProducer.state1(0),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(2, 1), [1, 4]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(3, 2), [2, 5]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_3_4(3), [3, 6]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(5, 4), [6, 7]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(6, 5), [5, 8]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(7, 6), [6, 9]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_7_8(7), [8, 11]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_9_13(8), [10, 11]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_10__15(9), [9, 13]),
            LessonProducer.state12(10)
        ];
    }

    public static generateLessonsV1(): LessonProducer[] {
        return [
            LessonProducer.createStateProducerForGoals_1_2(0),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_3_4(1), [2, 3, 4]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(5, 2), [6, 7]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(6, 3), [5, 8]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducer(7, 4), [6, 9]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_7_8(5), [8, 11]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_9_13(6), [10, 11]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_10__15(7), [9, 13]),
            LessonProducer.state12(8)
        ];
    }

    public static generateLessons(): LessonProducer[] {
        return [
            LessonProducer.createStateProducerForGoals_1_2(0),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_3_4(1), [2, 3, 4]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_5_6(2), [6, 7]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_7_8(3), [8, 9, 6]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_9_13(4), [10, 11]),
            LessonProducer.shuffleFreeCellStarPosition(LessonProducer.createStateProducerForGoals_10__15(5), [9, 13]),
            LessonProducer.state12(6)
        ];
    }

    private static createStateProducerForGoals_1_2(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [1, 2];
        o.lockedStateElements = [];
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static state1(lessonNb: number): LessonProducer {
        return LessonProducer.createStateProducer(1, lessonNb);
    }

    private static createStateProducerForGoals_3_4(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [3, 4];
        o.lockedStateElements = [1, 2];
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, [1, 2, 3]);
        return o;
    }

    private static createStateProducerForGoals_5_6(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [5, 6];
        o.lockedStateElements = [1, 2, 3, 4];
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static createStateProducer(goal: number, lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [goal];
        o.lockedStateElements = Array.from({ length: goal - 1 }, (_, i) => i + 1);
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static shuffleFreeCellStarPosition(stateProducer: LessonProducer, availableFreeCellIndexes: number[]): LessonProducer {
        const newFreeCellIndex = Utils.shuffleArray(availableFreeCellIndexes)[0]
        const oldFreeCellIndex = stateProducer.state.indexOf(-1);
        const v = stateProducer.state[newFreeCellIndex];
        stateProducer.state[newFreeCellIndex] = -1;
        stateProducer.state[oldFreeCellIndex] = v;
        return stateProducer;
    }

    private static createStateProducerForGoals_7_8(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [7, 8];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6];
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, [1, 2, 3, 4, 5, 6, 7]);
        return o;
    }

    private static createStateProducerForGoals_9_13(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [9, 13];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6, 7, 8];
        o.state = [...LessonProducer.stateDone];
        o.episodesToTrain = 100;
        LessonProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static shufleSteps = 100;

    private static createStateProducerForGoals_10__15(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [10, 11, 14, 15];
        o.lockedStateElements = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9,
            13
        ];
        o.state = StateShuffle.shuffle([...LessonProducer.stateDone], o.lockedStateElements, this.shufleSteps);
        o.episodesToTrain = 100;
        return o;
    }

    private static state12(lessonNb: number): LessonProducer {
        const o = new LessonProducer(lessonNb);
        o.goals = [12];
        o.lockedStateElements = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11,
            13, 14, 15
        ];
        o.state = StateShuffle.shuffle([...LessonProducer.stateDone], o.lockedStateElements, this.shufleSteps);
        o.episodesToTrain = 10;
        return o;
    }

    public isLockedIndex(index: number): boolean {
        return this.lockedStateElements.includes(index + 1);
    }

    private static shuffle(o: LessonProducer, lockedStateElements: number[]): void {
        let v0 = o.state.filter(e => !lockedStateElements.includes(e));
        v0 = Utils.shuffleArray(v0);
        o.state = [...lockedStateElements, ...v0];
    }

    // private static shuffle_vx(lessonProducer: LessonProducer): void {
    //     // lessonProducer.getLockedStateElements();

    //     /*
    //     const boardStateTerminal=
    //                                 [1,  2,  3,  4,
    //                                  5,  6,  7,  8,
    //                                  9,  10, 11, 12
    //                                  13, 14, 15  -1]

    //     */

    //     let lockedStateElements = lessonProducer.getLockedStateElements();

    //     LessonProducer.stateDone.filter(e => lockedStateElements.findIndex(x => x === e) != -1)
    //     const fixedStateIndexes = lessonProducer.getLockedStateElements().map(e => e - 1);

    //     let v0 = lessonProducer.state.filter(e => !lockedStateElements.includes(e));
    //     v0 = Utils.shuffleArray(v0);
    //     lessonProducer.state = [...lockedStateElements, ...v0];
    // }

    //old .. biski nesamone kad .. generuoju auksciau .. o poto environment'e vel is naujo ta pati darau
    public resetStateV0(): void {
        const o = LessonProducer.generateLessons()[this.lessonNb];
        this.goals = [...o.goals];
        this.lockedStateElements = [...o.lockedStateElements];
        this.state = [...o.state];
    }

    // ~ .. biski nesamone kad .. generuoju auksciau .. o poto environment'e vel is naujo ta pati darau
    public async resetState(): Promise<void> {
        const stateProducers = await LessonProducer.getLessonProducersFromJson();
        const o = stateProducers[this.lessonNb];
        this.goals = [...o.goals];
        this.lockedStateElements = [...o.lockedStateElements];
        this.state = [...o.state];
    }
}
