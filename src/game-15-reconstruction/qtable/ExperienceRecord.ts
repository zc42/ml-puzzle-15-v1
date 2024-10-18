import { Action } from '../environment/Action'; 
import { EnvironmentState } from '../environment/EnvironmentState'; 

export class ExperienceRecord {
    private readonly state: EnvironmentState;
    private readonly action: Action;
    private readonly reward: number;
    private readonly done: boolean;
    private readonly newState: EnvironmentState;

    constructor(state: EnvironmentState, action: Action, reward: number, done: boolean, newState: EnvironmentState) {
        this.state = new EnvironmentState(state); 
        this.action = action;
        this.reward = reward;
        this.done = done;
        this.newState = new EnvironmentState(newState); 
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
        return this.state.getHashCodeV2() ^ this.newState.getHashCodeV2(); 
    }
}
