import { QTableRow } from './QTableRow';
import { StateProducer } from './lessons/StateProducer';
import { EpisodeRunner } from './EpisodeRunner';
import { Utils } from './utils/Utils';
import { Semaphore } from './utils/Semaphore';

export class Trainer {

    private episodeRunner: EpisodeRunner = new EpisodeRunner();
    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;

    public async train(qTable: Map<number, QTableRow>, n: number) {
        this.semaphoreId = Trainer.semaphore.enable();

        //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------

        EpisodeRunner.experience.clear();

        const discount = 0.9;
        const learningRate = 0.1;
        // const lessons = StateProducer.generateLessons();
        const lessons = await StateProducer.getStateProducersFromJson();

        const episodeRunnerF = async (stateProducer: StateProducer, trainerInfo: string): Promise<void> => {
            await this.episodeRunner.runEpisode(stateProducer, qTable, discount, learningRate, trainerInfo, this.semaphoreId);
        };

        const stateProducerConsumer = async (stateProducer: StateProducer, trainerInfo: string): Promise<void> => {
            let episodesCount = stateProducer.getEpisodesToTrain();
            for (let episode = 0; episode < episodesCount; episode++) {
                let infoMessage = "Episode: " + (episode + 1) + " of " + episodesCount + "\n" + trainerInfo;
                await episodeRunnerF(stateProducer, infoMessage);
            }
        };

        for (let i = 0; i < n; i++) {
            let trainerInfo = "Running training batch: " + (i + 1) + " of " + n;
            await Promise.all(lessons.map(e => stateProducerConsumer(e, trainerInfo)));
        }

        Utils.prnt("training done");
    }

    public stop(): void {
        Trainer.semaphore.disable();
    }
}
