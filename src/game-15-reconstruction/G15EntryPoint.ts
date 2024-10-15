import { QTableGenerator } from './QTableGenerator';
import { Utils } from './utils/Utils';
// import { ConsoleUtils } from './utils/ConsoleUtils';

export class G15EntryPoint {

    public static async main() {
        // ConsoleUtils.testPrint();
        Utils.prnt("tarining starts in:");
        for (let i = 0; i < 3; i++) {
            Utils.prnt(i);
            await Utils.sleep(500);
        }

        Utils.prnt("tarining .. ");
        await Utils.sleep(1000);
        await QTableGenerator.train();
        await Utils.sleep(1000);
        Utils.prnt("testing .. ");
        await Utils.sleep(1000);
        await QTableGenerator.test();
    }
}
