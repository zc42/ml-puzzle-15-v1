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
import { EnvironmentActionResult } from '../environment/EnvironmentActionResult';

export class EpisodeRunner {
    public static experience: Set<ExperienceRecord> = new Set();

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
        environment.prntInfo();

        const epsilon = 0.5;
        let isTerminal = false;
        let step = 0;

        while (!isTerminal && step < 50) {
            //-------------some hack------------
            if (!Trainer.semaphore.goodToGo(semaphoreId)) return;
            //----------------------------------

            step++;
            let action: Action;

            const possibleActions = Environment.getPossibleActions(state0);
            if (environment.reverseAction !== null) {
                const index = possibleActions.indexOf(environment.reverseAction);
                possibleActions.splice(index, 1); // Remove reverse action
            }

            if (Math.random() < epsilon) { // Explore
                Utils.prnt("\nrndm move");
                action = GameUtils.getRandomAction(possibleActions);
            } else { // Exploit
                Utils.prnt("\nqTable move");
                action = GameUtils.getAction(qTable, state0, environment.reverseAction);

                if (!possibleActions.includes(action)) {
                    action = GameUtils.getAction(qTable, state0, environment.reverseAction);
                }
            }

            Utils.prnt("\n\n------------------------------------------------------------------\n");
            Utils.prnt("\naction: " + action);

            const result: EnvironmentActionResult = environment.executeAction(state0, action);
            const state1 = result.state;
            environment.prntInfo();

            const reward = result.reward;
            isTerminal = result.isTerminal;

            if (isTerminal) {
                isTerminal = true;
            }

            const record = new ExperienceRecord(state0, action, reward, isTerminal, state1);
            EpisodeRunner.experience.add(record);
            state0 = result.state;
        }

        EpisodeRunner.replayExperience(EpisodeRunner.experience, qTable, learningRate, discount, 10000);
        if (EpisodeRunner.experience.size > 10000) EpisodeRunner.experience.clear();

        const statsInfo = `QTable size: ${qTable.size}, experience size: ${EpisodeRunner.experience.size}`;
        Utils.prnt("\n");
        await Utils.sleep(0);
        Utils.prnt(trainerInfo);
        Utils.prnt(statsInfo);
        ConsoleUtils.prntStatsInfo(statsInfo);

        await Utils.sleep(500);
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
            .sort(() => Math.random() - 0.5) // Shuffle
            .slice(0, sampleSize); // Limit to sampleSize

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