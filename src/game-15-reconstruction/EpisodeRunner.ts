import { QTableRow } from './QTableRow';
import { Environment } from './Environment';
import { StateProducer } from './StateProducer';
import { ExperienceRecord } from './ExperienceRecord';
import { QTableGenerator } from './QTableGenerator';
import { QTableUpdater } from './QTableUpdater';
import { Action } from './Action';
import { EnvironmentActionResult } from './EnvironmentActionResult';
import { Utils } from './utils/Utils';
import { ConsoleUtils } from './utils/ConsoleUtils';

export class EpisodeRunner {
    private static experience: Set<ExperienceRecord> = new Set();

    public static async runEpisode(
        stateProducer: StateProducer,
        qTable: Map<number, QTableRow>,
        discount: number,
        learningRate: number,
        episode: number,
        trainerInfo: string
    ) {
        const random = new Random();
        const environment = new Environment(stateProducer);
        environment.reset();
        let state0 = environment.getInitState();
        environment.prntInfo();

        const epsilon = 0.5;
        let isTerminal = false;
        let step = 0;

        while (!isTerminal && step < 50) {
            step++;
            let action: Action;

            const possibleActions = Environment.getPossibleActions(state0);
            if (environment.reverseAction !== null) {
                const index = possibleActions.indexOf(environment.reverseAction);
                possibleActions.splice(index, 1); // Remove reverse action
            }

            if (random.nextDouble() < epsilon) { // Explore
                Utils.prnt("\nrndm move");
                action = QTableGenerator.getRandomAction(possibleActions);
            } else { // Exploit
                Utils.prnt("\nqTable move");
                action = QTableGenerator.getAction(qTable, state0, environment.reverseAction);

                if (!possibleActions.includes(action)) {
                    action = QTableGenerator.getAction(qTable, state0, environment.reverseAction);
                }
            }

            Utils.prnt("\n--------------------------------------------------------");
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

        EpisodeRunner.replayExperience(EpisodeRunner.experience, qTable, learningRate, discount, 1000);

        const count = Array.from(qTable.values()).reduce((acc, e) => acc + e.qValues.size, 0);
        const message = `Episode ${episode} done, states count: ${count}, experience size: ${EpisodeRunner.experience.size}`;
        
        Utils.prnt(message);
        Utils.prnt(trainerInfo);

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

// Random class to handle random number generation
class Random {
    public nextDouble(): number {
        return Math.random();
    }
}
