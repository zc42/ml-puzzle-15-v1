import { Utils } from './game-15-reconstruction/utils/Utils';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { QTableGenerator } from './game-15-reconstruction/QTableGenerator';
import { GameUtils } from './game-15-reconstruction/GameUtils';
import { EpisodeTester } from './game-15-reconstruction/EpisodeTester';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTrainingBtn')?.addEventListener('click', () => ToolBox.startTraining().then());
    document.getElementById('startTestingBtn')?.addEventListener('click', () => ToolBox.startTesting().then());
    document.getElementById('pretrainedBtn')?.addEventListener('click', () => ToolBox.usePretrainedOnOff().then());
    document.getElementById('zenGardenBtn')?.addEventListener('click', () => ToolBox.zenGardenOnOff().then());
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

  private static async usePretrainedOnOff() {
    this.btnOnOff('pretrainedBtn', 'use pretrained', e => EpisodeTester.usePreloadedActions = e)
  }
  private static async zenGardenOnOff() {
    this.btnOnOff('zenGardenBtn', 'zen garden', e => GameUtils.zenGardenOn = e)
  }

  private static async btnOnOff(btnId: string, text: string, fn: (input: boolean) => void) {
    let btn = document.getElementById(btnId);
    let value = btn?.getAttribute('value');
    if (value !== text + ' off') {
      btn?.setAttribute('value', text + ' off');
      fn(false);
    } else {
      btn?.setAttribute('value', text + ' on');
      fn(true);
    }
  }
}

ToolBox.setupTools();