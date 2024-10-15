import { Utils } from './utils/Utils';
import { StateShuffle } from './StateShuffle';

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

    public static generateLessons0(): StateProducer[] {
        return [
            StateProducer.state1(0),
            StateProducer.moveHole(StateProducer.stateX(2, 1), [1, 4]),
            StateProducer.moveHole(StateProducer.stateX(3, 2), [2, 5]),
            StateProducer.moveHole(StateProducer.state3_4(3), [3, 6]),
            StateProducer.moveHole(StateProducer.stateX(5, 4), [6, 7]),
            StateProducer.moveHole(StateProducer.stateX(6, 5), [5, 8]),
            StateProducer.moveHole(StateProducer.stateX(7, 6), [6, 9]),
            StateProducer.moveHole(StateProducer.state7_8(7), [8, 11]),
            StateProducer.moveHole(StateProducer.state9_13(8), [10, 11]),
            StateProducer.moveHole(StateProducer.state10_15(9), [9, 13]),
            StateProducer.state12(10)
        ];
    }

    public static generateLessonsV1(): StateProducer[] {
        return [
            StateProducer.state1_2(0),
            StateProducer.moveHole(StateProducer.state3_4(1), [2, 3, 4]),
            StateProducer.moveHole(StateProducer.stateX(5, 2), [6, 7]),
            StateProducer.moveHole(StateProducer.stateX(6, 3), [5, 8]),
            StateProducer.moveHole(StateProducer.stateX(7, 4), [6, 9]),
            StateProducer.moveHole(StateProducer.state7_8(5), [8, 11]),
            StateProducer.moveHole(StateProducer.state9_13(6), [10, 11]),
            StateProducer.moveHole(StateProducer.state10_15(7), [9, 13]),
            StateProducer.state12(8)
        ];
    }

    public static generateLessons(): StateProducer[] {
        return [
            StateProducer.state1_2(0),
            StateProducer.moveHole(StateProducer.state3_4(1), [2, 3, 4]),
            StateProducer.moveHole(StateProducer.state5_6(2), [6, 7]),
            StateProducer.moveHole(StateProducer.state7_8(3), [8, 9, 6]),
            StateProducer.moveHole(StateProducer.state9_13(4), [10, 11]),
            StateProducer.moveHole(StateProducer.state10_15(5), [9, 13]),
            StateProducer.state12(6)
        ];
    }

    private static state1_2(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [1, 2];
        o.lockedStateElements = [];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static state1(lessonNb: number): StateProducer {
        return StateProducer.stateX(1, lessonNb);
    }

    private static state3_4(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [3, 4];
        o.lockedStateElements = [1, 2];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, [1, 2, 3]);
        return o;
    }

    private static state5_6(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [5, 6];
        o.lockedStateElements = [1, 2, 3, 4];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static stateX(goal: number, lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [goal];
        o.lockedStateElements = Array.from({ length: goal - 1 }, (_, i) => i + 1);
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static moveHole(o: StateProducer, holeIndexes: number[]): StateProducer {
        const ih = Utils.shuffleArray(holeIndexes)[0]
        const i = o.state.indexOf(-1);
        const v = o.state[ih];
        o.state[ih] = -1;
        o.state[i] = v;
        return o;
    }

    private static state7_8(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [7, 8];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, [1, 2, 3, 4, 5, 6, 7]);
        return o;
    }

    private static state9_13(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [9, 13];
        o.lockedStateElements = [1, 2, 3, 4, 5, 6, 7, 8];
        o.state = [...StateProducer.stateDone];
        o.episodesToTrain = 100;
        StateProducer.shuffle(o, o.lockedStateElements);
        return o;
    }

    private static state10_15(lessonNb: number): StateProducer {
        const o = new StateProducer(lessonNb);
        o.goals = [10, 11, 14, 15];
        o.lockedStateElements = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9,
            13
        ];
        o.state = StateShuffle.shuffle([...StateProducer.stateDone], o.lockedStateElements, 500);
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
        o.state = StateShuffle.shuffle([...StateProducer.stateDone], o.lockedStateElements, 500);
        o.episodesToTrain = 10;
        return o;
    }

    public isLockedIndex(index: number): boolean {
        return this.lockedStateElements.includes(index + 1);
    }

    public shuffleState(): void {
        this.state = StateShuffle.shuffle(this.state, this.lockedStateElements, 500);
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

    // Additional methods and classes like StateShuffle are assumed to be defined elsewhere.
}
