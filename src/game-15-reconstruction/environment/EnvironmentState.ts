import { StateProducer } from '../lessons/StateProducer';

export interface EnvironmentStateI {
  state: number[];
  goals: number[];
  fixedElements: number[];
}

export class EnvironmentState {
  public state: number[];
  public goals: number[];
  public fixedElements: number[];

  public static getTestCase(): EnvironmentState {
    let a: EnvironmentStateI = {
      state: [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, -1,
        14, 15, 12, 13],
      goals: [12],
      fixedElements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    }
    return new EnvironmentState(a);
  }

  constructor(state: EnvironmentState);
  constructor(state: EnvironmentStateI);
  constructor(state: number[], stateProducer: StateProducer);
  constructor(state: number[] | EnvironmentState | EnvironmentStateI, stateProducer?: StateProducer) {
    if ('state' in state && 'goals' in state && 'fixedElements' in state) {
      // Handling EnvironmentStateI and the boolean flag
      this.state = [...state.state];
      this.goals = [...state.goals];
      this.fixedElements = [...state.fixedElements];
    } else if (state instanceof EnvironmentState) {
      // Copy constructor logic
      this.state = [...state.getState()];
      this.goals = [...state.getGoals()];
      this.fixedElements = [...state.getFixedElements()];
    } else {
      // Regular constructor logic
      this.state = [...state];
      this.goals = [...(stateProducer?.getGoals() ?? [])];
      this.fixedElements = [...(stateProducer?.getLockedStateElements() ?? [])];
    }
  }

  public getState(): number[] {
    return this.state;
  }

  public setState(state: number[]): void {
    this.state = state;
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
      const o = this.state[e];
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
    const a = this.state.map(String).join(",");
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
