import { QTableRow } from './QTableRow'; // Adjust the import according to your project structure
import { SerializedObjectSaver } from './utils/SerializedObjectSaver'; // Adjust the import according to your project structure
import { StateProducer } from './StateProducer'; // Adjust the import according to your project structure
import { EpisodeRunner } from './EpisodeRunner'; // Adjust the import according to your project structure

export class Trainer {
    public static train(qTable: Map<number, QTableRow>, filePath: string, n: number): void {
        const discount = 0.9;
        const learningRate = 0.1;

        const lessons = StateProducer.generateLessons();

        const episodeRunner = (stateProducer: StateProducer, episode: number): void => {
            EpisodeRunner.runEpisode(stateProducer, qTable, discount, learningRate, episode);
        };

        const stateProducerConsumer = (stateProducer: StateProducer): void => {
            for (let episode = 0; episode < stateProducer.getEpisodesToTrain(); episode++) {
                episodeRunner(stateProducer, episode);
            }
        };

        for (let i = 0; i < n; i++) {
            lessons.forEach(stateProducerConsumer);
        }

        console.log("\ntraining done");
        SerializedObjectSaver.save(filePath, qTable);
    }
}