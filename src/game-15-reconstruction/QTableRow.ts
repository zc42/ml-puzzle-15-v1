import { Action } from './Action';
import { Environment } from './Environment';
import { EnvironmentState } from './EnvironmentState';

export class QTableRow {
    private state: EnvironmentState;
    public qValues: Map<Action, number>;

    constructor(state: EnvironmentState) {
        this.state = state;
        this.qValues = new Map<Action, number>();
    }

    public setValue(action: Action, qValue: number): void {
        const moves = Environment.getPossibleActions(this.state);
        if (this.qValues.size === 0) {
            moves.forEach(e => this.qValues.set(e, 0));
        }
        if (!moves.includes(action)) {
            console.warn("WARNING: !moves.includes(action)");
            return;
        }
        this.qValues.set(action, qValue);
    }

    public getValue(action: Action): number {
        return this.qValues.get(action) || 0;
    }

    public getActionWithMaxValue(lastAction: Action | null): Action {
        const possibleActions = Environment.getPossibleActions(this.state).filter(action => action !== lastAction);
        const actionOption = lastAction === null ? null : this.getAction(lastAction);

        if (actionOption === null || actionOption === undefined) {
            console.warn("WARNING: no action found");
            return possibleActions.length > 0 ? possibleActions[0] : Action.D; // Default action
        } else {
            return actionOption;
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
