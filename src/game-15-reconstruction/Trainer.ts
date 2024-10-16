import { QTableRow } from './QTableRow'; // Adjust the import according to your project structure
// import { SerializedObjectSaver } from './utils/SerializedObjectSaver'; // Adjust the import according to your project structure
import { StateProducer } from './StateProducer'; // Adjust the import according to your project structure
import { EpisodeRunner } from './EpisodeRunner'; // Adjust the import according to your project structure
import { Utils } from './utils/Utils';

export class Trainer {
    public static async train(qTable: Map<number, QTableRow>, n: number) {
        const discount = 0.9;
        const learningRate = 0.1;

        const lessons = StateProducer.generateLessons();

        const episodeRunner = async (stateProducer: StateProducer, episode: number, trainerInfo: string): Promise<void> => {
            await EpisodeRunner.runEpisode(stateProducer, qTable, discount, learningRate, episode, trainerInfo);
        };

        const stateProducerConsumer = async (stateProducer: StateProducer, trainerInfo: string): Promise<void> => {
            for (let episode = 0; episode < stateProducer.getEpisodesToTrain(); episode++) {
                await episodeRunner(stateProducer, episode, trainerInfo);
            }
        };

        for (let i = 0; i < n; i++) {
            let trainerInfo = "Running training batch: " + (i + 1) + " of " + n;
            await Promise.all(lessons.map(e => stateProducerConsumer(e, trainerInfo)));
        }

        Utils.prnt("training done");
    }
}
