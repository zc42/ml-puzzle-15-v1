import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { EntryPoint } from './EntryPoint';
import { Action } from '../environment/Action';
import { QTableUpdater } from './QTableUpdater';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { GameUtils } from '../environment/GameUtils';
import { StateShuffle } from '../lessons/StateShuffle';
import { StateProducer } from '../lessons/StateProducer';
import { Environment } from '../environment/Environment';
import { EnvironmentState } from '../environment/EnvironmentState';


export class ShadowTesterCtx {

    lessonNo: number = 0;
    lessons: StateProducer[];
    lessonCount: number;
    stateProducer: StateProducer;

    state: EnvironmentState;
    goals: number[];

    gameOver: boolean = false;
    step: number = 0;
    reverseAction: Action | null = null;

    lastMoveTime: number;
    lastPrnt: string = '';

    constructor(lessons: StateProducer[]) {
        this.lessons = lessons;
        this.lessonCount = lessons.length;
        this.stateProducer = lessons[this.lessonNo];

        let v = StateShuffle.shuffle(StateProducer.stateDone, [], 1000);
        this.state = new EnvironmentState(v, this.stateProducer);
        this.goals = this.stateProducer.getGoals();

        this.lastMoveTime = new Date().getTime();
    }

    public resetIfGameIsOver() {
        if (!this.gameOver) return;

        this.lessonNo = 0;
        let boardState = StateShuffle.shuffle(StateProducer.stateDone, [], 1000);
        this.state = new EnvironmentState(boardState, this.stateProducer);
        this.goals = this.stateProducer.getGoals();

        this.gameOver = false;
        this.step = 0;
        this.reverseAction = null;

        console.log('resetIfGameIsOver');
    }
}

export class ShadowTester {

    ctx: ShadowTesterCtx | null = null;
    lessons: StateProducer[] | null = null;
    pauseBetweenMoves: number = 1;

    public async init() {
        const lessons = await StateProducer.getStateProducersFromJson();
        this.ctx = new ShadowTesterCtx(lessons);
    }

    public makeMove(): void {

        console.log('ShadowTester .. ');

        if (this.ctx === null) return ;
        this.ctx.resetIfGameIsOver();

        // let timePassed = this.getTimePassedInSeconds(this.ctx.lastMoveTime);
        // console.log('timePassed: ', timePassed)
        // if (timePassed < this.pauseBetweenMoves) return this.ctx.lastPrnt;
        // this.ctx.lastMoveTime = new Date().getTime();

        this.ctx.step++;
        const qTable = EntryPoint.qTable

        let action = this.getAction(qTable, this.ctx.state, this.ctx.reverseAction);
        this.ctx.reverseAction = GameUtils.getReverseAction(action);
        const newState = GameUtils.makeMove(this.ctx.state.getBoardState(), action);
        const isTerminal = Environment._isTerminalSuccess(newState, this.ctx.goals);

        this.ctx.state = new EnvironmentState(newState, this.ctx.stateProducer);
        this.ctx.gameOver = Utils.equalArrays(this.ctx.state.getBoardState(), StateProducer.stateDone);

        // await Utils.sleep(1000 / 2);
        // ConsoleUtils.clearScreen();

        // if (!GameUtils.zenGardenOn) Utils.prnt(`${this.ctx.step}\n----\n`);
        this.prntState(this.ctx.state, this.ctx.step);
        // await Utils.sleep(500);

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
            // if (!GameUtils.zenGardenOn) Utils.prnt(`----\n${terminalMessage}`);
            this.prntTerminalState(this.ctx.state, this.ctx.step, terminalMessage);
        }

        // this.ctx.lastPrnt = GameUtils.getStateAsString(this.ctx.state.getBoardState(), this.ctx.state.getGoals());
        // return this.ctx.lastPrnt;
    }

    // private getTimePassedInSeconds(startTime: number): number {
    //     const endTime = new Date().getTime();
    //     const timePassed = (endTime - startTime) / 1000; // Convert milliseconds to seconds
    //     return timePassed;
    // }


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