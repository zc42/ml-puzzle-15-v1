import { Utils } from './game-15-reconstruction/utils/Utils';
import { EpisodeRunner } from './game-15-reconstruction/EpisodeRunner';
import { QTableGenerator } from './game-15-reconstruction/QTableGenerator';

export class ToolBox {

  public static  setupTools() {
    document.getElementById('startTraining')?.addEventListener('click', () => this.startTraining().then());
    document.getElementById('startTesting')?.addEventListener('click', () => this.startTesting());
  }

  private static async startTraining() {
    Utils.prnt("starting training ... ");
    await Utils.sleep(0);
    QTableGenerator.testingEnabled = false;
    EpisodeRunner.trainingEnabled = true;
    QTableGenerator.train().then();
  }

  private static startTesting() {
    EpisodeRunner.trainingEnabled = false;
    QTableGenerator.testingEnabled = true;
    QTableGenerator.test().then();
  }
}

ToolBox.setupTools();