import { Pair } from '../utils/Pair';
import { QTableRow } from '../qtable/QTableRow';
import { Environment } from './Environment';
import { EnvironmentState } from './EnvironmentState';
import { Action } from './Action';
import { ConsoleUtils } from '../utils/ConsoleUtils';

export class GameUtils {
    public static zenGardenOn: boolean = false;

    public static makeMove(state: number[], action: Action): number[] {
        const hole = -1;
        const i0 = state.indexOf(hole);
        const xy = this.getXY(i0);
        let x = xy.getKey();
        let y = xy.getValue();

        if (action === Action.L) x -= 1;
        if (action === Action.R) x += 1;
        if (action === Action.U) y -= 1;
        if (action === Action.D) y += 1;

        const i1 = this.getIndex(x, y);

        // Clone state array and perform swap
        const newState = [...state];
        const v = newState[i1];
        newState[i0] = v;
        newState[i1] = hole;
        return newState;
    }

    public static getXY(index: number): Pair<number, number> {
        const x = index % 4;
        const y = Math.floor(index / 4);
        return Pair.P(x, y);
    }

    public static getIndex(x: number, y: number): number {
        return y * 4 + x;
    }

    public static _getValidMoves(index: number): Action[] {
        const xy = this.getXY(index);
        const moves = Object.values(Action).slice(); // Clone Action enum values

        if (xy.getKey() === 0) moves.splice(moves.indexOf(Action.L), 1);
        if (xy.getKey() === 3) moves.splice(moves.indexOf(Action.R), 1);
        if (xy.getValue() === 0) moves.splice(moves.indexOf(Action.U), 1);
        if (xy.getValue() === 3) moves.splice(moves.indexOf(Action.D), 1);

        return moves;
    }

    public static getValidMoves(i: number, fixedStateIndexes: number[]): Action[] {
        const moves = this._getValidMoves(i);
        const xy = this.getXY(i);

        if (this.contains(fixedStateIndexes, xy.getKey() - 1, xy.getValue())) {
            moves.splice(moves.indexOf(Action.L), 1);
        }
        if (this.contains(fixedStateIndexes, xy.getKey() + 1, xy.getValue())) {
            moves.splice(moves.indexOf(Action.R), 1);
        }
        if (this.contains(fixedStateIndexes, xy.getKey(), xy.getValue() - 1)) {
            moves.splice(moves.indexOf(Action.U), 1);
        }
        if (this.contains(fixedStateIndexes, xy.getKey(), xy.getValue() + 1)) {
            moves.splice(moves.indexOf(Action.D), 1);
        }

        return moves;
    }

    private static contains(fixedStateIndexes: number[], x: number, y: number): boolean {
        return fixedStateIndexes.includes(this.getIndex(x, y));
    }

    
    public static stateAsString(state: number[], goals: number[]): string {
        if (this.zenGardenOn) return this.getStateAsZenStoneGarden(state, goals);
        else return this.getStateAsString(state, goals);
    }

    public static getStateAsString(state: number[], goals: number[]): string {
        return Array.from({ length: 16 }, (_, e) => {
            let v: string;
            const o = state[e];

            if (o === -1) v = ConsoleUtils.blue("*");
            else if (goals.includes(o)) v = ConsoleUtils.red(o.toString());
            else if (goals.includes(e + 1)) v = ConsoleUtils.green(o.toString());
            else v = o.toString();

            v += "\t";
            if (e !== 0 && (e + 1) % 4 === 0) {
                v += "\n";
            }
            return v;
        }).join('');
    }

    public static getStateAsZenStoneGarden(state: number[], goals: number[]): string {
        return Array.from({ length: 16 }, (_, e) => {
            let v: string;
            const o = state[e];

            // if (o === -1) v = "::";
            // else 
            if (goals.includes(o)) v = 'x';
            else if (goals.includes(e + 1)) v = 'o';
            else v = '';

            v += '\t';
            if (e !== 0 && (e + 1) % 4 === 0) {
                v += '\n';
            }
            return v;
        }).join('');
    }

    public static prntState(state: number[], goals: number[]): void {
        let s = this.stateAsString(state, goals);
        ConsoleUtils.prnt(s);
    }

    public static getReverseAction(action: Action): Action | null {
        return action === Action.D ? Action.U
            : action === Action.U ? Action.D
                : action === Action.L ? Action.R
                    : action === Action.R ? Action.L
                        : null;
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

    public static getFirstPossibleActionOrD(state: EnvironmentState, reverseAction: Action | null): Action {
        const possibleActions = Environment.getPossibleActions(state).filter(action => action !== reverseAction);
        return possibleActions.length > 0 ? possibleActions[0] : Action.D; // Default action
    }
}
