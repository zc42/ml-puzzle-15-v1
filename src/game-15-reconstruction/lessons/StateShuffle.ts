import { GameUtils } from '../environment/GameUtils';
import { Utils } from '../utils/Utils';

export class StateShuffle {

  public static shuffle(state: number[], lockedStateElements: number[], steps: number): number[] {
    const fixedStateIndexes = lockedStateElements.map(e => e - 1);

    let i = 0;
    while (i < steps) {
      state = StateShuffle.makeRandomMove(state, fixedStateIndexes);
      i++;
    }

    return state;
  }

  static makeRandomMove(state: number[], fixedStateIndexes: number[]): number[] {
    const i = state.indexOf(-1);
    const moves = GameUtils.getValidMoves(i, fixedStateIndexes);
    const action = Utils.shuffleArray(moves)[0];
    state = GameUtils.makeMove(state, action);
    return state;
  }
}
