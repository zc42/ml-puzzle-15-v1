import { QTableRow } from './QTableRow';
import { StateProducer } from './StateProducer';
import { StateShuffle } from './StateShuffle';
import { Environment } from './Environment';
import { EnvironmentState } from './EnvironmentState';
import { Action } from './Action';
import { GameUtils } from './GameUtils';
import { QTableUpdater } from './QTableUpdater';
import { Utils } from './utils/Utils';
import { ConsoleUtils } from './utils/ConsoleUtils';
import { QTableGenerator } from './QTableGenerator';
import { Semaphore } from './utils/Semaphore';

export class EpisodeTester {

    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;

    public async test() {
        this.semaphoreId = EpisodeTester.semaphore.enable();
        //-------------some hack------------
        if (!EpisodeTester.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------

        const qTable = QTableGenerator.qTable
        const stats = EpisodeTester.getStatistics(qTable);
        Utils.prnt(stats);

        while (true) {
            //-------------some hack------------
            if (!EpisodeTester.semaphore.goodToGo(this.semaphoreId)) return;
            //----------------------------------
            await this.testQTable(qTable);
        }
    }

    public stop(): void {
        EpisodeTester.semaphore.disable();
    }

    private async testQTable(qTable: Map<number, QTableRow>) {
        //-------------some hack------------
        if (!EpisodeTester.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------
        // ConsoleUtils.clearScreen();

        // Utils.prnt("********************* test q table **********************");
        // Utils.prnt("********************* test q table **********************");
        // Utils.prnt("********************* test q table **********************");

        let lessonNo = 0;
        const lessons = StateProducer.generateLessons();
        const lessonCount = lessons.length;
        let stateProducer = lessons[lessonNo];
        let v = StateShuffle.shuffle(StateProducer.stateDone, [], 1000);
        let state = new EnvironmentState(v, stateProducer);
        let goals = stateProducer.getGoals();

        ConsoleUtils.clearScreen();
        Utils.prnt(`0\n----\n`);
        EpisodeTester.prntState(state);

        let gameOver = false;
        let step = 0;
        let reverseAction: Action | null = null;

        // await Utils.sleep(1000);
        // ConsoleUtils.clearScreen();
        while (!gameOver && step < 200) {
            //-------------some hack------------
            if (!EpisodeTester.semaphore.goodToGo(this.semaphoreId)) return;
            //----------------------------------
            step++;
            const state0Hash = state.getHashCodeV2();

            QTableUpdater.addStateWithZeroValuesToQTableIfStateNotExist(qTable, state);

            const qTableRow = qTable.get(state0Hash);
            const action = qTableRow ? qTableRow.getActionWithMaxValue(reverseAction) : Action.D;

            reverseAction = GameUtils.getReverseAction(action);

            const newState = GameUtils.makeMove(state.getState(), action);
            const isTerminal = Environment._isTerminalSuccess(newState, goals);

            state = new EnvironmentState(newState, stateProducer);
            gameOver = Utils.equalArrays(state.getState(), StateProducer.stateDone);

            await Utils.sleep(1000 / 2);
            ConsoleUtils.clearScreen();
            Utils.prnt(`${step}\n----\n`);
            EpisodeTester.prntState(state);

            if (isTerminal && !gameOver && lessonNo < lessonCount - 1) {
                lessonNo++;
                stateProducer = lessons[lessonNo];
                goals = stateProducer.getGoals();
                Utils.prnt(`lesson change: ${lessonNo}`);
                Utils.prnt(goals);
                await Utils.sleep(2000);
                state = new EnvironmentState(state.getState(), stateProducer);
            }
        }

        const isTerminalSuccess = Environment.isTerminalSuccess(state);
        Utils.prnt(`success: ${isTerminalSuccess}`);
        await Utils.sleep(3000);
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
