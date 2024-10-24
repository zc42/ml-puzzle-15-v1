import { Trainer } from './Trainer';
import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { EntryPoint } from './EntryPoint';
import { Action } from '../environment/Action';
import { QTableUpdater } from './QTableUpdater';
import { GameUtils } from '../environment/GameUtils';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { ExperienceRecord } from './ExperienceRecord';
import { Environment } from '../environment/Environment';
import { LessonProducer } from '../environment/LessonProducer';

export class EpisodeRunner {
    public static experience: Set<ExperienceRecord> = new Set();
    private maxExperienceSize = 2000;

    public async train(
        lessonProducer: LessonProducer,
        discount: number,
        learningRate: number,
        trainerInfo: string,
        semaphoreId: number | null
    ): Promise<void> {
        // //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(semaphoreId)) return;
        // //----------------------------------

        const qTable = EntryPoint.qTable;
        const environment = new Environment(lessonProducer);
        environment.reset();
        let state0 = environment.getInitState();

        const epsilon = 0.5;
        let isTerminal = false;
        let step = 0;

        while (!isTerminal && step < 50) {
            // //-------------some hack------------
            if (!Trainer.semaphore.goodToGo(semaphoreId)) return;
            // //----------------------------------

            step++;
            if (Environment._isTerminalSuccess(state0.getBoardState(), state0.getGoals())) break;
            let action: Action;
            let possibleActions = GameUtils.getPossibleActions(state0).filter(e => e !== environment.reverseAction);

            if (possibleActions.length === 0) {
                GameUtils.logBoardState(state0.boardState);
                possibleActions = GameUtils.getPossibleActions(state0)
                console.log('environment.reverseAction', environment.reverseAction);
                console.log('possibleActions 1', possibleActions);
                possibleActions = possibleActions.filter(e => e !== environment.reverseAction);
                console.log('possibleActions 2', possibleActions);
                throw new Error('possibleActions.length === 0');
            }

            if (Math.random() < epsilon) { // Explore
                action = GameUtils.getRandomAction(possibleActions);
            } else { // Exploit
                action = GameUtils.getAction(qTable, state0, environment.reverseAction);
            }

            const result = environment.executeAction(state0, action);
            const state1 = result.state;
            const reward = result.reward;
            isTerminal = result.isTerminal;
            const record = new ExperienceRecord(state0, action, reward, isTerminal, state1);
            EpisodeRunner.experience.add(record);
            state0 = result.state;
        }

        EpisodeRunner.replayExperience(EpisodeRunner.experience, qTable, learningRate, discount, this.maxExperienceSize);
        if (EpisodeRunner.experience.size > this.maxExperienceSize) EpisodeRunner.experience.clear();
        const statsInfo = `QTable size: ${qTable.size}, experience size: ${EpisodeRunner.experience.size}`;

        let episodeTrainerMsg = '\n' + trainerInfo + '\n' + statsInfo;
        ConsoleUtils.prntAtSomeElement('episodeTrainer', episodeTrainerMsg);


        ConsoleUtils.prntStatsInfo(statsInfo + '\nfor original lessons - it will start to show some intelligence\nwhen the qtable size is around 8500 .. ;)');

        await Utils.sleep(0);
    }

    public static replayExperience(
        experience: Set<ExperienceRecord>,
        qTable: Map<number, QTableRow>,
        learningRate: number,
        discount: number,
        sampleSize: number
    ): void {
        const sampledExperience = Array.from(experience)
            .sort(() => Math.random() - 0.5)
            .slice(0, sampleSize);

        sampledExperience.forEach(e => {
            QTableUpdater.updateQTable(
                qTable,
                e.getState(),
                e.getAction(),
                e.getNewState(),
                e.getReward(),
                e.isDone(),
                learningRate,
                discount
            );
        });
    }
}