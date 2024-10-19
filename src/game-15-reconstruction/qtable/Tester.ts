import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { EntryPoint } from './EntryPoint';
import { Action } from '../environment/Action';
import { Semaphore } from '../utils/Semaphore';
import { QTableUpdater } from './QTableUpdater';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { GameUtils } from '../environment/GameUtils';
import { StateShuffle } from '../lessons/StateShuffle';
import { StateProducer } from '../lessons/StateProducer';
import { Environment } from '../environment/Environment';
import { PretrainedDataLoader } from './QTableActionsLoader';
import { EnvironmentState } from '../environment/EnvironmentState';
import { ConfigLoader, Config } from '../configuration/ConfigLoader';

export class Tester {

    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;
    public static usePreloadedActions: boolean;
    private static actionMap: Map<string, Action> | null = null;

    public async test(): Promise<void> {

        const config: Config = await ConfigLoader.getConfig();
        Tester.usePreloadedActions = config.use_pretrained_data_while_testing;

        if (Tester.usePreloadedActions && Tester.actionMap === null)
            Tester.actionMap = await PretrainedDataLoader.getQTableActionMap();

        this.semaphoreId = Tester.semaphore.enable();
        //-------------some hack------------
        if (!Tester.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------

        const qTable = EntryPoint.qTable
        const stats = Tester.getStatistics(qTable);
        Utils.prnt(stats);

        while (true) {
            //-------------some hack------------
            if (!Tester.semaphore.goodToGo(this.semaphoreId)) return;
            //----------------------------------
            await this.testQTable(qTable);
        }
    }

    public stop(): void {
        Tester.semaphore.stop();
    }

    private async testQTable(qTable: Map<number, QTableRow>) {
        //-------------some hack------------
        if (!Tester.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------

        let lessonNo = 0;
        const lessons = await StateProducer.getStateProducersFromJson();
        const lessonCount = lessons.length;
        let stateProducer = lessons[lessonNo];
        let v = StateShuffle.shuffle(StateProducer.stateDone, [], 1000);
        let state = new EnvironmentState(v, stateProducer);
        let goals = stateProducer.getGoals();

        ConsoleUtils.clearScreen();
        if (!GameUtils.zenGardenOn) Utils.prnt(`0\n----\n`);
        Tester.prntState(state);

        let gameOver = false;
        let step = 0;
        let reverseAction: Action | null = null;

        while (!gameOver && step < 200) {
            //-------------some hack------------
            if (!Tester.semaphore.goodToGo(this.semaphoreId)) return;
            //----------------------------------
            step++;

            let action = this.getAction(qTable, state, reverseAction);
            reverseAction = GameUtils.getReverseAction(action);
            const newState = GameUtils.makeMove(state.getState(), action);
            const isTerminal = Environment._isTerminalSuccess(newState, goals);

            state = new EnvironmentState(newState, stateProducer);
            gameOver = Utils.equalArrays(state.getState(), StateProducer.stateDone);

            await Utils.sleep(1000 / 2);
            ConsoleUtils.clearScreen();
            if (!GameUtils.zenGardenOn) Utils.prnt(`${step}\n----\n`);
            Tester.prntState(state);

            if (isTerminal && !gameOver && lessonNo < lessonCount - 1) {
                lessonNo++;
                stateProducer = lessons[lessonNo];
                goals = stateProducer.getGoals();
                state = new EnvironmentState(state.getState(), stateProducer);
            }
        }

        const terminalMessage = Environment.isTerminalSuccess(state)
            ? 'success'
            : 'failed';
        if (!GameUtils.zenGardenOn) Utils.prnt(`----\n${terminalMessage}`);
        await Utils.sleep(3000);
    }


    // AAAAAAAAAAAAAAAAA   aaaaa   ... sream all u want .. there is no sound in vacume 
    private getAction(
        qTable: Map<number, QTableRow>,
        state: EnvironmentState,
        reverseAction: Action | null
    ): Action {

        if (Tester.usePreloadedActions
            && Tester.actionMap !== null
            && Tester.actionMap.size > 0) {

            let key = PretrainedDataLoader.getStateActionKey(state);
            if (Tester.actionMap?.has(key)) {
                let action = Tester.actionMap.get(key);
                if (action === undefined) ConsoleUtils.prntErrorMsg('no action found');
                return action === undefined
                    ? GameUtils.getFirstPossibleAction(state, reverseAction)
                    : action;
            }
            let action = GameUtils.getFirstPossibleAction(state, reverseAction);
            ConsoleUtils.prntErrorMsg('no action for current state was found, first posible action is: ' + action);
            return action;
        } else {
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
    }

    private static prntState(state: EnvironmentState): void {
        GameUtils.prntState(state.getState(), state.getGoals());
    }

    private static getStatistics(qTable: Map<number, QTableRow>): Stats {
        const values = Array.from(qTable.values()).flatMap(row => Array.from(row.qValues.values()));
        const sum = values.reduce((a, b) => a + b, 0);
        const count = values.length;
        const average = count ? sum / count : 0;
        const stats = new Stats();
        stats.count = count;
        stats.sum = sum;
        stats.average = average;
        return stats;
    }
}

class Stats {
    public count: number = 0;
    public sum: number = 0;
    public average: number = 0;
}
