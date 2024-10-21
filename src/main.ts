import { EntryPoint } from './game-15-reconstruction/qtable/EntryPoint';
import { AboutLoader } from './game-15-reconstruction/about/AboutLoader';
import { GameUtils } from './game-15-reconstruction/environment/GameUtils';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { LessonsEditor } from './game-15-reconstruction/configuration/ConfigEditor';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTrainingBtn')?.addEventListener('click', () => ToolBox.startTraining().then());
    document.getElementById('startTestingBtn')?.addEventListener('click', () => ToolBox.startTesting().then());
    document.getElementById('zenGardenBtn')?.addEventListener('click', () => ToolBox.zenGardenOnOff().then());
    document.getElementById('configurationBtn')?.addEventListener('click', () => ToolBox.configurationOnOff().then());
    document.getElementById('aboutBtn')?.addEventListener('click', () => ToolBox.configOnOff().then());
  }

  private static async startTraining() {
    EntryPoint.stopTester();
    ConsoleUtils.clearScreen();
    await EntryPoint.train();
    await ToolBox.startTesting();
  }

  public static async startTesting() {
    EntryPoint.stopTrainer();
    ConsoleUtils.clearScreen();
    await EntryPoint.test();
  }

  private static async configOnOff() {
    this.btnOff('configurationBtn', 'configuration', show => LessonsEditor.toggleLessonsDisplay(show));
    this.btnOnOff('aboutBtn', 'about', show => AboutLoader.toggleConfigurationDisplay(show));
  }

  private static async configurationOnOff() {
    this.btnOff('aboutBtn', 'about', show => AboutLoader.toggleConfigurationDisplay(show));
    this.btnOnOff('configurationBtn', 'configuration', show => LessonsEditor.toggleLessonsDisplay(show));
  }

  private static async zenGardenOnOff() {
    this.btnOnOff('zenGardenBtn', 'zen garden', e => GameUtils.zenGardenOn = e)
  }

  private static async btnOff(btnId: string, text: string, fn: (input: boolean) => void) {
    let btn = document.getElementById(btnId);
    btn?.setAttribute('value', text + ' off');
    fn(false);
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
ToolBox.startTesting().then();
