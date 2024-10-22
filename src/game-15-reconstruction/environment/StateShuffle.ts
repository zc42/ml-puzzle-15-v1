import { GameUtils } from '../environment/GameUtils';
import { Utils } from '../utils/Utils';
import { Pair } from '../utils/Pair';

export class StateShuffle {

  public static shuffle(state: number[], lockedStateElements: number[], steps: number): number[] {
    const fixedStateIndexes = lockedStateElements.map(e => e - 1);
    for (let i = 0; i < steps; i++) {
      state = StateShuffle.makeRandomMove(state, fixedStateIndexes);
    }
    return state;
  }

  static makeRandomMove(state: number[], fixedStateIndexes: number[]): number[] {
    const i = state.indexOf(-1);
    const moves = GameUtils.getValidMoves(i, fixedStateIndexes);
    const action = Utils.shuffleArray(moves)[0];
    return GameUtils.makeMove(state, action);
  }

  public static shuffleForTraining(lockedStateElements: number[]): number[] {
    const freeElements = Array.from({ length: 16 }, (_, i) => i + 1).filter(e => !lockedStateElements.includes(e));
    const randomFreeElements = [...freeElements].sort(() => Math.random() - 0.5);
    const paired = freeElements.map((e, i) => Pair.from(e, randomFreeElements[i]));
    const shuffledBoardState = Array.from({ length: 16 }, (_, i) => this.zip(paired, i));
    return shuffledBoardState.map(e => (e.getValue() === 16 ? -1 : e.getValue()));
  }

  static zip(paired: Pair<number, number>[], index: number): Pair<number, number> {
    const pair = paired.find((e) => e.getKey() === index + 1);
    if (pair === undefined) return Pair.from(index, index + 1);
    return Pair.from(index, pair.getValue());
  }
}
