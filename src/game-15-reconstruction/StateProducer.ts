import { Utils } from './utils/Utils';
import { StateShuffle } from './StateShuffle';
import { Lesson, LessonsLoader } from './LessonsLoader';

export class StateProducer {
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

    public static async getStateProducersFromJson(): Promise<StateProducer[]> {
        let lessons = await LessonsLoader.getLessons();
        return lessons.map((e, i) => StateProducer.from(e, i));
    }

    private static from(lesson: Lesson, lessonNb: number): StateProducer {
        const stateProducer = new StateProducer(lessonNb);
        stateProducer.goals = lesson.goals;
        stateProducer.lockedStateElements = lesson.lockedElements !== undefined ? lesson.lockedElements : [];
        stateProducer.episodesToTrain = lesson.lessonsToGenerate !== undefined ? lesson.lessonsToGenerate : 100;

        stateProducer.state = [...StateProducer.stateDone];
        StateProducer.shuffle(stateProducer, stateProducer.lockedStateElements);

        return lesson.freeCellStartingPositions !== undefined
            ? StateProducer.shuffleFreeCellStarPosition(stateProducer, lesson.freeCellStartingPositions.map(e => e - 1))
            : stateProducer;
    }

    public static generateLessons0(): StateProducer[] {
        return [
            StateProducer.state1(0),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(2, 1), [1, 4]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(3, 2), [2, 5]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_3_4(3), [3, 6]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(5, 4), [6, 7]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(6, 5), [5, 8]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(7, 6), [6, 9]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_7_8(7), [8, 11]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_9_13(8), [10, 11]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_10__15(9), [9, 13]),
            StateProducer.state12(10)
        ];
    }

    public static generateLessonsV1(): StateProducer[] {
        return [
            StateProducer.createStateProducerForGoals_1_2(0),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_3_4(1), [2, 3, 4]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(5, 2), [6, 7]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(6, 3), [5, 8]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducer(7, 4), [6, 9]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_7_8(5), [8, 11]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_9_13(6), [10, 11]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_10__15(7), [9, 13]),
            StateProducer.state12(8)
        ];
    }

    public static generateLessons(): StateProducer[] {
        return [
            StateProducer.createStateProducerForGoals_1_2(0),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_3_4(1), [2, 3, 4]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_5_6(2), [6, 7]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_7_8(3), [8, 9, 6]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_9_13(4), [10, 11]),
            StateProducer.shuffleFreeCellStarPosition(StateProducer.createStateProducerForGoals_10__15(5), [9, 13]),
            StateProducer.state12(6)
        ];
    }

    private static createStateProducerForGoals_1_2(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [1, 2];
        o.lockedStateElements = [];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static state1(lessonNb: number): StateProducer {
        return StateProducer.createStateProducer(1, lessonNb);
    }

    private static createStateProducerForGoals_3_4(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [3, 4];
        o.lockedStateElements = [1, 2];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, [1, 2, 3]);
        return o;
    }

    private static createStateProducerForGoals_5_6(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [5, 6];
        o.lockedStateElements = [1, 2, 3, 4];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static createStateProducer(goal: number, lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [goal];
        o.lockedStateElements = Array.from({ length: goal - 1 }, (_, i) => i + 1);
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static shuffleFreeCellStarPosition(stateProducer: StateProducer, availableFreeCellIndexes: number[]): StateProducer {
        const newFreeCellIndex = Utils.shuffleArray(availableFreeCellIndexes)[0]
        const oldFreeCellIndex = stateProducer.state.indexOf(-1);
        const v = stateProducer.state[newFreeCellIndex];
        stateProducer.state[newFreeCellIndex] = -1;
        stateProducer.state[oldFreeCellIndex] = v;
        return stateProducer;
    }

    private static createStateProducerForGoals_7_8(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [7, 8];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, [1, 2, 3, 4, 5, 6, 7]);
        return o;
    }

    private static createStateProducerForGoals_9_13(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [9, 13];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6, 7, 8];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static shufleSteps = 100;

    private static createStateProducerForGoals_10__15(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [10, 11, 14, 15];
        o.lockedStateElements = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9,
            13
        ];
        o.state = StateShuffle.shuffle([...StateProducer.stateDone], o.lockedStateElements, this.shufleSteps);
        o.episodesToTrain = 100;
        return o;
    }

    private static state12(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [12];
        o.lockedStateElements = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11,
            13, 14, 15
        ];
        o.state = StateShuffle.shuffle([...StateProducer.stateDone], o.lockedStateElements, this.shufleSteps);
        o.episodesToTrain = 10;
        return o;
    }

    public isLockedIndex(index: number): boolean {
        return this.lockedStateElements.includes(index + 1);
    }

    private static shuffle(o: StateProducer, lockedStateElements: number[]): void {
        let v0 = o.state.filter(e => !lockedStateElements.includes(e));
        v0 = Utils.shuffleArray(v0);
        o.state = [...lockedStateElements, ...v0];
    }

    public resetState(): void {
        const o = StateProducer.generateLessons()[this.lessonNb];
        this.goals = [...o.goals];
        this.lockedStateElements = [...o.lockedStateElements];
        this.state = [...o.state];
    }
}
