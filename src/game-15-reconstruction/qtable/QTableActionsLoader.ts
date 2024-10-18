import { Action } from '../environment/Action';
import { FileLoader } from '../utils/FileLoader';
import { EnvironmentState } from '../environment/EnvironmentState';

export class PretrainedDataLoader {

    public static async getQTableActionMap(): Promise<Map<string, Action>> {

        const path1 = 'dist/qTableActions.csv';
        const path2 = '/public/qTableActions.csv';

        let data = await FileLoader.getFile(path1);
        data = data === '' ? await FileLoader.getFile(path2) : data;
        
        const lines = data.trim().split('\n');
        const map = new Map<string, Action>();
        lines.forEach((row) => {
            const [key, action] = row.trim().split(',');
            map.set(key, Action[action as keyof typeof Action]);
        });
        return map;
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
