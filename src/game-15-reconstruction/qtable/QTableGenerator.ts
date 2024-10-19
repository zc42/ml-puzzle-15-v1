import { Trainer } from './Trainer';
import { QTableRow } from './QTableRow';
import { Tester } from './Tester';

export class QTableGenerator {
    public static qTable = new Map<number, QTableRow>();
    private static trainer: Trainer | null = null;
    private static tester: Tester | null = null;

    public static async train() {
        this.trainer = new Trainer();
        await this.trainer.train(QTableGenerator.qTable, 10);
    }

    public static async test() {
        this.tester = new Tester();
        await this.tester.test();
    }

    public static async stopTrainer() {
        this.trainer?.stop();
    }

    public static async stopTester() {
        this.tester?.stop();
    }
}