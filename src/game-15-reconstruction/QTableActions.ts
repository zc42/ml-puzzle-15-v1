import { Action } from './Action';
import { EnvironmentState } from './EnvironmentState';

export class QTableActions {

    public static async getQTableActionsFile(): Promise<string> {
        let data = '';
        try {
            const response = await fetch('/public/qTableActions.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            data = await response.text();
        } catch (error) {
            console.error('Error reading file:', error);
        } finally {
            return data;
        }
    }


    public static async getQTableActions(): Promise<Map<string, Action>> {
        let data = await this.getQTableActionsFile();
        const lines = data.trim().split('\n');
        const map = new Map<string, Action>();
        lines.forEach((row) => {
            const [key, action] = row.trim().split(',');
            map.set(key, Action[action as keyof typeof Action]);
        });
        return map;
    }

    public static getHashCodeV3__(envState: EnvironmentState): string {
        const state = envState.getState();
        const goals = envState.getGoals();
        const key = Array.from({ length: 16 }, (_, e) => {
            let v: string;
            const o = state[e];
            if (o === -1) v = '*';
            else if (goals.includes(o)) v = `${o}`;
            else if (goals.includes(e + 1)) v = 'o';
            else v = ' ';

            v += '_';
            if (e !== 0 && (e + 1) % 4 === 0) v += '|';
            return v;
        }).join('');
        return key.trim();
    }

}
