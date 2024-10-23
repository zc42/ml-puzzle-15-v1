import { EntryPoint } from './game-15-reconstruction/qtable/EntryPoint';
import { AboutLoader } from './game-15-reconstruction/about/AboutLoader';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { GameUtils } from './game-15-reconstruction/environment/GameUtils';
import { ConfigurationEditor } from './game-15-reconstruction/configuration/ConfigEditor';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTrainingBtn')?.addEventListener('click', () => ToolBox.startTraining().then());
    document.getElementById('startTestingBtn')?.addEventListener('click', () => ToolBox.startTesting().then());
    document.getElementById('zenGardenBtn')?.addEventListener('click', () => ToolBox.zenGardenOnOff().then());
    document.getElementById('configurationBtn')?.addEventListener('click', () => ToolBox.configurationOnOff().then());
    document.getElementById('aboutBtn')?.addEventListener('click', () => ToolBox.aboutOnOff().then());
  }

  private static async startTraining() {
    ConsoleUtils.prntErrorMsg('');
    EntryPoint.stopTester();
    ConsoleUtils.clearScreen();
    await EntryPoint.train();
    await ToolBox.startTesting();
  }

  public static async startTesting() {
    ConsoleUtils.prntErrorMsg('');
    EntryPoint.stopTrainer();
    ConsoleUtils.clearScreen();
    await EntryPoint.test();
  }

  private static async aboutOnOff() {
    this.btnOff('configurationBtn', 'configuration', show => ConfigurationEditor.toggleDisplay(show));
    this.btnOnOff('aboutBtn', 'about', show => AboutLoader.toggleDisplay(show));
  }

  private static async configurationOnOff() {
    this.btnOff('aboutBtn', 'about', show => AboutLoader.toggleDisplay(show));
    this.btnOnOff('configurationBtn', 'configuration', show => ConfigurationEditor.toggleDisplay(show));
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
    ConsoleUtils.prntErrorMsg('');
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
