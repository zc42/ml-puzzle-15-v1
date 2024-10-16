import { Utils } from './game-15-reconstruction/utils/Utils';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { EpisodeRunner } from './game-15-reconstruction/EpisodeRunner';
import { QTableGenerator } from './game-15-reconstruction/QTableGenerator';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTraining')?.addEventListener('click', () => this.startTraining().then());
    document.getElementById('startTesting')?.addEventListener('click', () => this.startTesting().then());
  }

  private static async startTraining() {
    ConsoleUtils.clearScreen();
    ConsoleUtils.prnt("starting training session ... ");
    await Utils.sleep(0);
    QTableGenerator.testingEnabled = false;
    EpisodeRunner.trainingEnabled = true;
    QTableGenerator.train()
      .then(() => this.startTesting().then());

  }

  private static async startTesting() {
    ConsoleUtils.clearScreen();
    ConsoleUtils.prnt("start testing ... ");
    await Utils.sleep(0);
    EpisodeRunner.trainingEnabled = false;
    QTableGenerator.testingEnabled = true;
    QTableGenerator.test().then();
  }
}

ToolBox.setupTools();