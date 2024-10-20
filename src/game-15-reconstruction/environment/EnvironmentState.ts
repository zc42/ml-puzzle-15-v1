import { StateProducer } from '../lessons/StateProducer';

export interface EnvironmentStateI {
  boardState: number[];
  goals: number[];
  fixedElements: number[];
}

export class EnvironmentState {
  public boardState: number[];
  public goals: number[];
  public fixedElements: number[];

  public static getTestCase(): EnvironmentState {
    let testCase: EnvironmentStateI = {
      boardState: [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, -1,
        14, 15, 12, 13],
      goals: [12],
      fixedElements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    }
    return new EnvironmentState(testCase);
  }

  constructor(state: EnvironmentState);
  constructor(state: EnvironmentStateI);
  constructor(boardState: number[], stateProducer: StateProducer);
  constructor(boardState: number[] | EnvironmentState | EnvironmentStateI, stateProducer?: StateProducer) {
    if ('boardState' in boardState && 'goals' in boardState && 'fixedElements' in boardState) {
      // Handling EnvironmentStateI and the boolean flag
      this.boardState = [...boardState.boardState];
      this.goals = [...boardState.goals];
      this.fixedElements = [...boardState.fixedElements];
    } else if (boardState instanceof EnvironmentState) {
      // Copy constructor logic
      this.boardState = [...boardState.getBoardState()];
      this.goals = [...boardState.getGoals()];
      this.fixedElements = [...boardState.getFixedElements()];
    } else {
      // Regular constructor logic
      this.boardState = [...boardState];
      this.goals = [...(stateProducer?.getGoals() ?? [])];
      this.fixedElements = [...(stateProducer?.getLockedStateElements() ?? [])];
    }
  }

  public getBoardState(): number[] {
    return this.boardState;
  }

  public setBoardState(state: number[]): void {
    this.boardState = state;
  }

  public getGoals(): number[] {
    return this.goals;
  }

  public setGoals(goals: number[]): void {
    this.goals = goals;
  }

  public getFixedElements(): number[] {
    return this.fixedElements;
  }

  public setFixedElements(fixedElements: number[]): void {
    this.fixedElements = fixedElements;
  }

  public getHashCodeV2(): number {
    const hashCode = this.getHashCodeV3__();
    return this.hashString(hashCode);
  }

  public getHashCodeV3__(): string {
    return Array.from({ length: 16 }, (_, e) => {
      let v: string;
      const o = this.boardState[e];
      if (o === -1) v = "*";
      else if (this.goals.includes(o)) v = String(o);
      else if (this.goals.includes(e + 1)) v = "o";
      else v = " ";
      v = v + "\t";
      if (e !== 0 && (e + 1) % 4 === 0) v = v + "\n";
      return v;
    }).join("");
  }

  public getHashCode(): number {
    const a = this.boardState.map(String).join(",");
    return this.hashString(a);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  public equals(other: EnvironmentState): boolean {
    return this.getHashCode() === other.getHashCode();
  }

  public hashCode(): number {
    return this.getHashCode();
  }
}
