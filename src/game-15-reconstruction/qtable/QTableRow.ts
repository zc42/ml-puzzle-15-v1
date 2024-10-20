import { Action } from '../environment/Action';
import { GameUtils } from '../environment/GameUtils';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { EnvironmentState } from '../environment/EnvironmentState';

export class QTableRow {
    private state: EnvironmentState;
    public qValues: Map<Action, number>;

    constructor(state: EnvironmentState) {
        this.state = state;
        this.qValues = new Map<Action, number>();
    }

    public setValue(action: Action, qValue: number): void {
        const moves = GameUtils.getPossibleActions(this.state);
        if (this.qValues.size === 0) {
            moves.forEach(e => this.qValues.set(e, 0));
        }
        if (!moves.includes(action)) {
            // ConsoleUtils.warn("WARNING: !moves.includes(action)");
            return;
        }
        this.qValues.set(action, qValue);
    }

    public getState(): EnvironmentState {
        return this.state;
    }

    public getValue(action: Action): number {
        return this.qValues.get(action) || 0;
    }

    public getActionWithMaxValue(reverseAction: Action | null): Action {
        const action = reverseAction === null ? null : this.getAction(reverseAction);
        if (action === null || action === undefined) {
            let possibleActions = GameUtils.getPossibleActions(this.state);
            possibleActions = possibleActions.filter(action => action !== reverseAction);
            if (possibleActions.length === 0) {
                ConsoleUtils.prntErrorMsg('possibleActions.length === 0, there allways must be some action to go around.. need to debug.')
                throw new Error('possibleActions.length === 0, there allways must be some action to go around.. need to debug.');
            }
            return possibleActions[0];
        } else {
            return action;
        }
    }

    private getAction(lastAction: Action): Action | undefined {
        const filteredEntries = Array.from(this.qValues.entries()).filter(([key]) => key !== lastAction);
        const maxEntry = filteredEntries.reduce((max, entry) => (entry[1] > max[1] ? entry : max), [lastAction, -Infinity]);
        return maxEntry[1] > -Infinity ? maxEntry[0] : undefined;
    }

    public getMaxValue(): number {
        // Check if qValues is empty
        if (this.qValues.size === 0) return 0;

        // Convert the values of the map to an array and get the maximum value
        return Math.max(...Array.from(this.qValues.values()));
    }
}
