import { Action } from './Action';
import { EnvironmentState } from './EnvironmentState';

export class QTableActions {

    public static async getQTableActions(): Promise<Map<string, Action>> {

        const path1 = 'dist/qTableActions.csv';
        const path2 = '/public/qTableActions.csv';

        let data = await this.getQTableActionsFile(path1);
        data = data === '' ? await this.getQTableActionsFile(path2) : data;
        const lines = data.trim().split('\n');
        const map = new Map<string, Action>();
        lines.forEach((row) => {
            const [key, action] = row.trim().split(',');
            map.set(key, Action[action as keyof typeof Action]);
        });
        return map;
    }

    private static async getQTableActionsFile(filePath: string): Promise<string> {
        let data = '';
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            data = await response.text();
        } catch (error) {
            console.error('Error reading file: ' + filePath, error);
        } finally {
            return data;
        }
    }

    public static getStateActionKey(envState: EnvironmentState): string {
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
