import { Tester } from './game-15-reconstruction/qtable/Tester';
import { EntryPoint } from './game-15-reconstruction/qtable/EntryPoint';
import { GameUtils } from './game-15-reconstruction/environment/GameUtils';
import { ConsoleUtils } from './game-15-reconstruction/utils/ConsoleUtils';
import { LessonsEditor } from './game-15-reconstruction/lessons/LessonsEditor';
import { ConfigEditor } from './game-15-reconstruction/configuration/ConfigEditor';

export class ToolBox {

  public static setupTools() {
    document.getElementById('startTrainingBtn')?.addEventListener('click', () => ToolBox.startTraining().then());
    document.getElementById('startTestingBtn')?.addEventListener('click', () => ToolBox.startTesting().then());
    document.getElementById('pretrainedBtn')?.addEventListener('click', () => ToolBox.usePretrainedOnOff().then());
    document.getElementById('zenGardenBtn')?.addEventListener('click', () => ToolBox.zenGardenOnOff().then());
    document.getElementById('lessonsBtn')?.addEventListener('click', () => ToolBox.lessonsOnOff().then());
    document.getElementById('configBtn')?.addEventListener('click', () => ToolBox.configOnOff().then());
    this.startTesting().then();
  }

  private static async startTraining() {
    EntryPoint.stopTester();
    ConsoleUtils.clearScreen();
    await EntryPoint.train();
    await ToolBox.startTesting();
  }

  private static async startTesting() {
    EntryPoint.stopTrainer();
    ConsoleUtils.clearScreen();
    await EntryPoint.test();
  }

  private static async configOnOff() {
    this.btnOff('lessonsBtn', 'training lessons', show => LessonsEditor.toggleLessonsDisplay(show));
    this.btnOnOff('configBtn', 'configuration', show => ConfigEditor.toggleConfigurationDisplay(show));
  }

  private static async lessonsOnOff() {
    this.btnOff('configBtn', 'configuration', show => ConfigEditor.toggleConfigurationDisplay(show));
    this.btnOnOff('lessonsBtn', 'training lessons', show => LessonsEditor.toggleLessonsDisplay(show));
  }

  private static async usePretrainedOnOff() {
    this.btnOnOff('pretrainedBtn', 'use pretrained', e => Tester.usePreloadedActions = e)
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