import { Utils } from './game-15-reconstruction/utils/Utils';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { QTableGenerator } from './game-15-reconstruction/QTableGenerator';
import { GameUtils } from './game-15-reconstruction/GameUtils';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTraining')?.addEventListener('click', () => ToolBox.startTraining().then());
    document.getElementById('startTesting')?.addEventListener('click', () => ToolBox.startTesting().then());
    document.getElementById('zenGarden')?.addEventListener('click', () => ToolBox.zenGardenOnOff().then());
    this.startTesting().then();
  }

  private static async startTraining() {
    QTableGenerator.stopTester();
    ConsoleUtils.clearScreen();
    Utils.prnt("starting training session ... ");
    await Utils.sleep(0);
    QTableGenerator.train()
      .then(() => ToolBox.startTesting().then());
  }

  private static async startTesting() {
    QTableGenerator.stopTrainer();
    ConsoleUtils.clearScreen();
    Utils.prnt("start testing ... ");
    await Utils.sleep(0);
    QTableGenerator.test().then();
  }

  private static async zenGardenOnOff() {
    let btn = document.getElementById('zenGarden');
    let value = btn?.getAttribute("value");
    if (value !== 'zen garden off') {
      btn?.setAttribute("value", "zen garden off");
      GameUtils.zenGardenOn = true;
    } else {
      btn?.setAttribute("value", "zen garden on");
      GameUtils.zenGardenOn = false;
    }
  }
}

ToolBox.setupTools();