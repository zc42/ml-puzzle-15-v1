import { EnvironmentState } from './EnvironmentState'; // Adjust the import according to your project structure
import { Action } from './Action'; // Adjust the import according to your project structure

export class ExperienceRecord {
    private readonly state: EnvironmentState;
    private readonly action: Action;
    private readonly reward: number;
    private readonly done: boolean;
    private readonly newState: EnvironmentState;

    constructor(state: EnvironmentState, action: Action, reward: number, done: boolean, newState: EnvironmentState) {
        this.state = new EnvironmentState(state); // Assuming a copy constructor exists in TypeScript
        this.action = action;
        this.reward = reward;
        this.done = done;
        this.newState = new EnvironmentState(newState); // Assuming a copy constructor exists in TypeScript
    }

    public getState(): EnvironmentState {
        return this.state;
    }

    public getAction(): Action {
        return this.action;
    }

    public getReward(): number {
        return this.reward;
    }

    public isDone(): boolean {
        return this.done;
    }

    public getNewState(): EnvironmentState {
        return this.newState;
    }

    public equals(other: ExperienceRecord): boolean {
        if (!(other instanceof ExperienceRecord)) return false;
        return this.hashCode() === other.hashCode();
    }

    public hashCode(): number {
        return this.state.getHashCodeV2() ^ this.newState.getHashCodeV2(); // Use bitwise XOR for combining hashes
    }
}
