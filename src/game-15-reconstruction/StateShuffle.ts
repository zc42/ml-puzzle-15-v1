import { StateProducer } from './StateProducer';
import { GameUtils } from './GameUtils';
import { Utils } from './utils/Utils';
// import { Action } from './Action';

export class StateShuffle {
  public static main(): void {
    const stateProducer = StateProducer.generateLessons()[0];
    let state = [...stateProducer.getState()];
    const goals = [...stateProducer.getGoals()];

    StateShuffle.prntState(state, goals);
    state = StateShuffle.shuffle(state, stateProducer.getLockedStateElements(), 1000);
    StateShuffle.prntState(state, goals);
  }

  public static shuffle(state: number[], lockedStateElements: number[], steps: number): number[] {
    const fixedStateIndexes = lockedStateElements.map(e => e - 1);

    let i = 0;
    while (i < steps) {
      state = StateShuffle.makeRandomMove(state, fixedStateIndexes);
      i++;
    }

    return state;
  }

  private static prntState(state: number[], goals: number[]): void {
    Utils.prnt(GameUtils.stateAsString(state, goals));
  }

  static makeRandomMove(state: number[], fixedStateIndexes: number[]): number[] {
    const i = state.indexOf(-1);
    const moves = GameUtils.getValidMoves(i, fixedStateIndexes);
    const action = Utils.shuffleArray(moves)[0];
    state = GameUtils.makeMove(state, action);
    return state;
  }
}
