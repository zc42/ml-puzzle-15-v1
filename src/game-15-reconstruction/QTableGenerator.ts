import { Trainer } from './Trainer';
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

export class QTableGenerator {
    public static qTable = new Map<number, QTableRow>();

    public static async train() {
        await Trainer.train(QTableGenerator.qTable, 10);
    }

    public static async test() {
        const qTable = QTableGenerator.qTable
        const stats = this.getStatistics(qTable);
        Utils.prnt(stats);

        while (true) {
            await this.testQTable(qTable);
        }
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

    public static async testQTable(qTable: Map<number, QTableRow>) {
        Utils.prnt("********************* test q table **********************");
        Utils.prnt("********************* test q table **********************");
        Utils.prnt("********************* test q table **********************");

        let lessonNo = 0;
        const lessons = StateProducer.generateLessons();
        const lessonCount = lessons.length;
        let stateProducer = lessons[lessonNo];
        let v = StateShuffle.shuffle(StateProducer.stateDone, [], 1000);
        let state = new EnvironmentState(v, stateProducer);
        let goals = stateProducer.getGoals();

        this.prntState(state);

        let gameOver = false;
        let step = 0;
        let reverseAction: Action | null = null;

        while (!gameOver && step < 200) {
            await Utils.sleep(1000 / 2);
            ConsoleUtils.clearScreen();

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

            Utils.prnt(`${step}\n----\n`);
            this.prntState(state);

            if (isTerminal && !gameOver && lessonNo < lessonCount - 1) {
                lessonNo++;
                stateProducer = lessons[lessonNo];
                goals = stateProducer.getGoals();
                Utils.prnt(`lesson change: ${lessonNo}`);
                Utils.prnt(goals);
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

    public static getAction(qTable: Map<number, QTableRow>, currentState: EnvironmentState, lastAction: Action | null): Action {
        const hash = currentState.getHashCodeV2();
        let possibleActions = Environment.getPossibleActions(currentState);
        possibleActions = possibleActions.filter(action => action !== lastAction);
        return qTable.has(hash)
            ? qTable.get(hash)?.getActionWithMaxValue(lastAction) || Action.D
            : this.getRandomAction(possibleActions);
    }

    public static getRandomAction(possibleActions: Action[]): Action {
        return possibleActions.length > 0
            ? possibleActions[Math.floor(Math.random() * possibleActions.length)]
            : Action.D;
    }


}

class Stats {
    public count: number = 0;
    public sum: number = 0;
    public average: number = 0;
}
