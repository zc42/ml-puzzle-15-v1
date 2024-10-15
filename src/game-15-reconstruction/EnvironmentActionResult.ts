import { Action } from './Action';  
import { EnvironmentState } from './EnvironmentState'; 

export class EnvironmentActionResult {
    state: EnvironmentState;
    action: Action;
    reward: number;
    isTerminal: boolean;

    constructor(
        state: EnvironmentState,
        action: Action,
        reward: number = 0,
        isTerminal: boolean = false
    ) {
        this.state = state; // Initialize with a default if not provided
        this.action = action; // Assuming Action has a default like NONE
        this.reward = reward;
        this.isTerminal = isTerminal;
    }
}
