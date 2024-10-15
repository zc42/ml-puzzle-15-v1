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

        const episodeRunner = async (stateProducer: StateProducer, episode: number): Promise<void> => {
            await EpisodeRunner.runEpisode(stateProducer, qTable, discount, learningRate, episode);
        };

        const stateProducerConsumer = async (stateProducer: StateProducer): Promise<void> => {
            for (let episode = 0; episode < stateProducer.getEpisodesToTrain(); episode++) {
                await episodeRunner(stateProducer, episode);
            }
        };

        for (let i = 0; i < n; i++) {
            await Promise.all(lessons.map(stateProducerConsumer));
        }

        Utils.prnt("training done");
    }
}
