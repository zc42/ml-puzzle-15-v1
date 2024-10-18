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
        this.state = state; 
        this.action = action; 
        this.reward = reward;
        this.isTerminal = isTerminal;
    }
}
