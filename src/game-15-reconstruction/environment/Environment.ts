import { Action } from './Action';
import { Pair } from '../utils/Pair';
import { Utils } from '../utils/Utils';
import { GameUtils } from './GameUtils';
import { LessonProducer } from './LessonProducer';
import { EnvironmentState } from './EnvironmentState';
import { EnvironmentActionResult } from './EnvironmentActionResult';

export class Environment {
    private state: EnvironmentState;
    private static lessonProducer: LessonProducer;
    private goals: number[];

    public reverseAction: Action | null = null;
    private bigCircleAction1: Action[] = [];
    private bigCircleAction2: Action[] = [];
    private smallCircleAction1: Action[] = [];
    private smallCircleAction2: Action[] = [];
    private circleAction: Action[] = [];

    constructor(lessonProducer: LessonProducer) {
        Environment.lessonProducer = lessonProducer;
        Environment.lessonProducer.shuffleBoardState();
        const state = Environment.lessonProducer.getState();
        this.goals = Environment.lessonProducer.getGoals();
        this.state = new EnvironmentState(state, Environment.lessonProducer);
    }

    public static isTerminalSuccess(state: EnvironmentState): boolean {
        return Environment._isTerminalSuccess(state.getBoardState(), state.getGoals());
    }

    public reset(): void {
        this.reverseAction = null;

        this.circleAction = [];
        this.bigCircleAction1 = [];
        this.bigCircleAction2 = [];
        this.smallCircleAction1 = [];
        this.smallCircleAction2 = [];

        this.bigCircleAction1.push(Action.L, Action.L, Action.D, Action.D, Action.R, Action.R, Action.U, Action.U);
        this.bigCircleAction2.push(Action.R, Action.R, Action.D, Action.D, Action.L, Action.L, Action.U, Action.U);
        this.smallCircleAction1.push(Action.L, Action.D, Action.R, Action.U, Action.L);
        this.smallCircleAction2.push(Action.R, Action.D, Action.L, Action.U, Action.R);
    }

    public getInitState(): EnvironmentState {
        Environment.lessonProducer.shuffleBoardState();
        const state = Environment.lessonProducer.getState();
        this.goals = Environment.lessonProducer.getGoals();
        this.state = new EnvironmentState(state, Environment.lessonProducer);
        return this.state;
    }

    public executeAction(state0: EnvironmentState, action: Action): EnvironmentActionResult {
        const newState = GameUtils.makeMove(state0.getBoardState(), action);
        const environmentState = new EnvironmentState(newState, Environment.lessonProducer);

        let isTerminal = Environment._isTerminalSuccess(newState, this.goals);
        this.state = new EnvironmentState(newState, Environment.lessonProducer);

        let r: number = NaN;

        this.reverseAction = GameUtils.getReverseAction(action);
        this.circleAction.push(action);
        if (this.circleAction.length > 8) this.circleAction.shift();

        if (Utils.equalArrays(this.circleAction, this.bigCircleAction1) ||
            Utils.equalArrays(this.circleAction, this.bigCircleAction2) ||
            Utils.equalArrays(this.circleAction, this.smallCircleAction1) ||
            Utils.equalArrays(this.circleAction, this.smallCircleAction2)) {
            isTerminal = true;
        }

        const io = this.state.getBoardState().indexOf(-1);
        if (Environment.lessonProducer.isLockedIndex(io)) {
            isTerminal = true;
            r = -1;
        }

        if (isNaN(r)) {
            r = this.getReward(newState, this.goals);
        }

        return new EnvironmentActionResult(environmentState, action, r, isTerminal);
    }

    public static _isTerminalSuccess(state: number[], goals: number[]): boolean {
        const goalsInCorrectPositions = goals.filter(e => state[e - 1] === e);
        return goalsInCorrectPositions.length === goals.length;
    }

    public prntInfo(): void {
        Utils.prnt("\n\n------------------------------------------------------------------\n");

        const boardState = this.state.getBoardState();
        const io = boardState.indexOf(-1);
        const xy = GameUtils.getXY(io);
        Utils.prnt(xy.getKey() + ' - ' + xy.getValue());
        const indx = GameUtils.getIndex(xy.getKey(), xy.getValue());
        Utils.prnt(`${io} - ${indx}`);
        const moves = GameUtils._getValidMoves(io);
        Utils.prnt(moves);
        const r = this.getReward(boardState, this.goals);
        Utils.prnt('reward: ' + r);
        Utils.prnt('\n');
        GameUtils.prntState(this.state);
    }

    private getReward(state: number[], goals: number[]): number {
        const ih = state.indexOf(-1);
        const xyh = GameUtils.getXY(ih);

        const floatStream = goals.map(e => this.getDistance(GameUtils.getXY(state.indexOf(e)), GameUtils.getXY(e - 1)));
        const d0Sum = floatStream.reduce((acc, val) => acc + val, 0);

        if (d0Sum === 0) {
            return 100.5;
        }

        const d1Sum = goals.reduce((acc, e) => acc + this.getDistance(GameUtils.getXY(state.indexOf(e)), xyh), 0);
        return 1 / (d0Sum + d1Sum);
    }

    private getDistance(v1: Pair<number, number>, v2: Pair<number, number>): number {
        const pow1 = Math.pow(v2.getKey() - v1.getKey(), 2);
        const pow2 = Math.pow(v2.getValue() - v1.getValue(), 2);
        return Math.sqrt(pow1 + pow2);
    }
}