import { Trainer } from './Trainer';
import { QTableRow } from './QTableRow';
import { TesterEntryPoint } from './Tester';

export class EntryPoint {

    public static qTable = new Map<number, QTableRow>();
    public static isTestingMode: boolean = true;

    private static trainer: Trainer | null = null;
    private static tester: TesterEntryPoint | null = null;

    public static async train() {
        this.isTestingMode = false;
        this.trainer = new Trainer();
        await this.trainer.train();
    }

    public static async test() {
        this.isTestingMode = true;
        this.tester = new TesterEntryPoint();
        await this.tester.test(undefined);
    }

    public static async stopTrainer() {
        this.trainer?.stop();
        this.trainer = null;
    }

    public static async stopTester() {
        this.tester?.stop();
        this.tester = null;
    }

    public static async restartTesterIfIsRunning() {
        if (this.tester === null) return;
        await this.stopTester();
        await this.test();
    }

    public static async restartTrainerIfIsRunning() {
        if (this.trainer === null) return;
        await this.stopTrainer();
        await this.train();
    }
}