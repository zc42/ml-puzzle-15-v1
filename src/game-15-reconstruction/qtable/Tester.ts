import { Utils } from '../utils/Utils';
import { EntryPoint } from './EntryPoint';
import { Action } from '../environment/Action';
import { QTableUpdater } from './QTableUpdater';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { GameUtils } from '../environment/GameUtils';
import { Environment } from '../environment/Environment';
import { StateShuffle } from '../environment/StateShuffle';
import { PretrainedDataLoader } from './QTableActionsLoader';
import { LessonProducer } from '../environment/LessonProducer';
import { EnvironmentState } from '../environment/EnvironmentState';
import { ConfigurationLoader } from '../configuration/ConfigLoader';

export class TesterEntryPoint {


    private static testerIntervalId: number | null = null;

    public async test(usePreloadedActionMap: boolean | undefined): Promise<void> {
        this.stop();
        const shadowTester = new Tester();
        await shadowTester.init(usePreloadedActionMap);
        shadowTester.makeMove();
        TesterEntryPoint.testerIntervalId = setInterval(() => shadowTester.makeMove(), 500);
    }

    public stop(): void {
        if (TesterEntryPoint.testerIntervalId === null) return;
        clearInterval(TesterEntryPoint.testerIntervalId);
        TesterEntryPoint.testerIntervalId = null;
    }
}

export class TesterCtx {

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

export class Tester {

    private ctx: TesterCtx | null = null;
    private maxEpisodeSteps: number = 200;

    public static usePreloadedActions: boolean = false;
    private static actionMap: Map<string, Action> | null = null;

    public async init(usePreloadedActionMap: boolean | undefined) {
        const lessons = await LessonProducer.getLessonProducersFromJson();
        this.ctx = new TesterCtx(lessons);
        await this.loadedActionMap(usePreloadedActionMap);
    }

    private async loadedActionMap(usePreloadedActionMap: boolean | undefined): Promise<void> {
        const config = await ConfigurationLoader.getConfiguration();
        Tester.usePreloadedActions = usePreloadedActionMap ?? config.usePretrainedDataWhileTesting ?? true;
        if (Tester.usePreloadedActions && Tester.actionMap === null)
            Tester.actionMap = await PretrainedDataLoader.getQTableActionMap();
    }

    public makeMove(): void {
        if (this.ctx === null) return;
        this.ctx.gameOver = this.isGameDone(this.ctx.state);
        this.ctx.resetIfGameIsOver();

        this.ctx.step++;
        let action = this.getAction(this.ctx.state, this.ctx.reverseAction);
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

    private getAction(state: EnvironmentState, reverseAction: Action | null): Action {
        return Tester.usePreloadedActions
            ? this.getActionFromActionMap(state, reverseAction)
            : this.getActionFromQTable(state, reverseAction);
    }

    private getActionFromQTable(state: EnvironmentState, reverseAction: Action | null): Action {
        const qTable = EntryPoint.qTable;
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

    private getActionFromActionMap(state: EnvironmentState, reverseAction: Action | null): Action {
        const actionMap = Tester.actionMap;
        let key = PretrainedDataLoader.getStateActionKey(state);
        if (actionMap?.has(key)) {
            let action = actionMap.get(key);
            if (action === undefined) ConsoleUtils.prntErrorMsg('no action found');
            return action === undefined
                ? GameUtils.getFirstPossibleAction(state, reverseAction)
                : action;
        } else {
            let action = GameUtils.getFirstPossibleAction(state, reverseAction);
            ConsoleUtils.prntErrorMsg('no action was found for state, first posible action is: ' + action);
            return action;
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