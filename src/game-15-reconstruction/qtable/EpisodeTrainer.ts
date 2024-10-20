import { Trainer } from './Trainer';
import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { Action } from '../environment/Action';
import { QTableUpdater } from './QTableUpdater';
import { GameUtils } from '../environment/GameUtils';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { ExperienceRecord } from './ExperienceRecord';
import { Environment } from '../environment/Environment';
import { StateProducer } from '../lessons/StateProducer';

export class EpisodeRunner {
    public static experience: Set<ExperienceRecord> = new Set();
    private maxExperienceSize = 2000;

    public async train(
        stateProducer: StateProducer,
        qTable: Map<number, QTableRow>,
        discount: number,
        learningRate: number,
        trainerInfo: string,
        semaphoreId: number | null
    ): Promise<void> {
        //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(semaphoreId)) return;
        //----------------------------------

        const environment = new Environment(stateProducer);
        environment.reset();
        let state0 = environment.getInitState();

        const epsilon = 0.5;
        let isTerminal = false;
        let step = 0;

        while (!isTerminal && step < 50) {
            //-------------some hack------------
            if (!Trainer.semaphore.goodToGo(semaphoreId)) return;
            //----------------------------------
            step++;
            if (Environment._isTerminalSuccess(state0.getState(), state0.getGoals())) break;
            let action: Action;
            const possibleActions = GameUtils.getPossibleActions(state0);
            if (environment.reverseAction !== null) {
                const index = possibleActions.indexOf(environment.reverseAction);
                possibleActions.splice(index, 1); // Remove reverse action
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

        //todo: show progress some how - .. EpisodeTester. ??

        EpisodeRunner.replayExperience(EpisodeRunner.experience, qTable, learningRate, discount, this.maxExperienceSize);
        if (EpisodeRunner.experience.size > this.maxExperienceSize) EpisodeRunner.experience.clear();

        const statsInfo = `QTable size: ${qTable.size}, experience size: ${EpisodeRunner.experience.size}`;
        Utils.prnt("\n");
        // await Utils.sleep(0);
        Utils.prnt(trainerInfo);
        Utils.prnt(statsInfo);
        ConsoleUtils.prntStatsInfo(statsInfo);

        await Utils.sleep(0);
        ConsoleUtils.clearScreen();
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