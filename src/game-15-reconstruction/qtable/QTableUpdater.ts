import { QTableRow } from './QTableRow'; 
import { Action } from '../environment/Action'; 
import { EnvironmentState } from '../environment/EnvironmentState';

export class QTableUpdater {

    public static updateQTable(
        qTable: Map<number, QTableRow>,
        state0: EnvironmentState,
        action: Action,
        state1: EnvironmentState,
        reward: number,
        isTerminal: boolean,
        learningRate: number,
        discount: number
    ): void {
        let _qValue: number;

        if (isTerminal) {
            _qValue = reward;
        } else {
            const qValue = this.getQValue(qTable, state0, action);
            const nextQValue = this.getMaxQValue(qTable, state1);
            _qValue = this.calcQValue(reward, qValue, nextQValue, discount, learningRate);
        }

        this.addStateWithZeroValuesToQTableIfStateNotExist(qTable, state0);
        this.updateQTableEntry(qTable, state0.getHashCodeV2(), action, _qValue);
    }

    private static updateQTableEntry(qTable: Map<number, QTableRow>, hash: number, action: Action, qValue: number): void {
        qTable.get(hash)?.setValue(action, qValue);
    }

    private static getMaxQValue(qTable: Map<number, QTableRow>, state: EnvironmentState): number {
        const hashCode = state.getHashCodeV2();
        this.addStateWithZeroValuesToQTableIfStateNotExist(qTable, state);
        return qTable.get(hashCode)?.getMaxValue() ?? 0; // Default to 0 if not found
    }

    private static getQValue(qTable: Map<number, QTableRow>, state: EnvironmentState, action: Action): number {
        const hashCode = state.getHashCodeV2();
        this.addStateWithZeroValuesToQTableIfStateNotExist(qTable, state);
        return qTable.get(hashCode)?.getValue(action) ?? 0; // Default to 0 if not found
    }

    public static addStateWithZeroValuesToQTableIfStateNotExist(qTable: Map<number, QTableRow>, state: EnvironmentState): void {
        if (qTable.has(state.getHashCodeV2())) return;
        this.addStateWithZeroValuesToQTable(qTable, state);
    }

    private static addStateWithZeroValuesToQTable(qTable: Map<number, QTableRow>, state: EnvironmentState): void {
        const hashCode = state.getHashCodeV2();
        const row = new QTableRow(state);
        qTable.set(hashCode, row); // Assuming of() method creates a new instance
    }

    private static calcQValue(
        reward: number,
        qValue: number,
        nextQValue: number,
        discount: number,
        learningRate: number
    ): number {
        const v = qValue + learningRate * (reward + discount * nextQValue - qValue);
        return v;
    }
}
