import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { EntryPoint } from './EntryPoint';
import { Action } from '../environment/Action';
import { QTableUpdater } from './QTableUpdater';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { GameUtils } from '../environment/GameUtils';
import { StateShuffle } from '../lessons/StateShuffle';
import { LessonProducer } from '../lessons/LessonProducer';
import { Environment } from '../environment/Environment';
import { EnvironmentState } from '../environment/EnvironmentState';


export class ShadowTesterCtx {

    lessonNo: number = 0;
    lessons: LessonProducer[];
    lessonCount: number;
    stateProducer: LessonProducer;

    state: EnvironmentState;
    goals: number[];

    gameOver: boolean = false;
    step: number = 0;
    reverseAction: Action | null = null;

    constructor(lessons: LessonProducer[]) {
        this.lessons = lessons;
        this.lessonCount = lessons.length;
        this.stateProducer = lessons[this.lessonNo];

        let v = StateShuffle.shuffle(LessonProducer.stateDone, [], 1000);
        this.state = new EnvironmentState(v, this.stateProducer);
        this.goals = this.stateProducer.getGoals();
    }

    public resetIfGameIsOver() {
        if (!this.gameOver) return;

        this.lessonNo = 0;
        this.stateProducer = this.lessons[this.lessonNo];
        let boardState = StateShuffle.shuffle(LessonProducer.stateDone, [], 1000);
        this.state = new EnvironmentState(boardState, this.stateProducer);
        this.goals = this.stateProducer.getGoals();

        this.gameOver = false;
        this.step = 0;
        this.reverseAction = null;
    }
}

export class ShadowTester {

    ctx: ShadowTesterCtx | null = null;
    lessons: LessonProducer[] | null = null;
    pauseBetweenMoves: number = 1;
    maxEpisodeSteps: number = 200;

    public async init() {
        const lessons = await LessonProducer.getLessonProducersFromJson();
        this.ctx = new ShadowTesterCtx(lessons);
    }

    public makeMove(): void {

        if (this.ctx === null) return;
        this.ctx.gameOver = this.isGameDone(this.ctx.state);
        this.ctx.resetIfGameIsOver();

        this.ctx.step++;
        const qTable = EntryPoint.qTable

        let action = this.getAction(qTable, this.ctx.state, this.ctx.reverseAction);
        this.ctx.reverseAction = GameUtils.getReverseAction(action);
        const newState = GameUtils.makeMove(this.ctx.state.getBoardState(), action);
        const isTerminal = Environment._isTerminalSuccess(newState, this.ctx.goals);

        this.ctx.state = new EnvironmentState(newState, this.ctx.stateProducer);
        this.ctx.gameOver = this.isGameDone(this.ctx.state);
        this.ctx.gameOver = this.ctx.step > this.maxEpisodeSteps;

        this.prntState(this.ctx.state, this.ctx.step);

        if (isTerminal && !this.ctx.gameOver && this.ctx.lessonNo < this.ctx.lessonCount - 1) {
            this.ctx.lessonNo++;
            this.ctx.stateProducer = this.ctx.lessons[this.ctx.lessonNo];
            this.ctx.goals = this.ctx.stateProducer.getGoals();
            this.ctx.state = new EnvironmentState(this.ctx.state.getBoardState(), this.ctx.stateProducer);
        }

        if (isTerminal && this.ctx.gameOver && this.ctx.lessonNo === this.ctx.lessonCount - 1) {
            const terminalMessage = Environment.isTerminalSuccess(this.ctx.state)
                ? 'success'
                : 'failed';
            this.prntTerminalState(this.ctx.state, this.ctx.step, terminalMessage);
        }

        this.ctx.resetIfGameIsOver();
    }

    private getAction(
        qTable: Map<number, QTableRow>,
        state: EnvironmentState,
        reverseAction: Action | null
    ): Action {

        const state0Hash = state.getHashCodeV2();
        QTableUpdater.addStateWithZeroValuesToQTableIfStateNotExist(qTable, state);
        const qTableRow = qTable.get(state0Hash);
        if (qTableRow) {
            return qTableRow.getActionWithMaxValue(reverseAction);
        }
        else {
            ConsoleUtils.prntErrorMsg('no action found');
            return GameUtils.getFirstPossibleAction(state, reverseAction);
        }
    }

    private isGameDone(state: EnvironmentState) {
        return Utils.equalArrays(state.getBoardState(), LessonProducer.stateDone);
    }

    private prntState(state: EnvironmentState, step: number): void {
        this.prntTerminalState(state, step, null);
    }

    private prntTerminalState(state: EnvironmentState, step: number, terminalMessage: string | null): void {
        let s0 = GameUtils.zenGardenOn ? '' : `${step}\n----\n`;
        let s1 = GameUtils.getStateAsString(state);
        let s2 = GameUtils.zenGardenOn || terminalMessage === null ? '' : `\n----\n${terminalMessage}`;
        ConsoleUtils.prntAtSomeElement('shadowTester', s0 + s1 + s2);
    }
}