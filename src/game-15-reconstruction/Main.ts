import { QTableGenerator } from './QTableGenerator';
import { Utils } from './utils/Utils';

export class Main {

    public static main() {
        
        Utils.prnt("kuku");
        QTableGenerator.train();
        QTableGenerator.test();
    }
}
