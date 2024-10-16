import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { Semaphore } from '../utils/Semaphore';
import { StateProducer } from '../lessons/StateProducer';
import { EpisodeRunner as EpisodeTrainer } from './EpisodeTrainer';

export class Trainer {

    private episodeTrainer: EpisodeTrainer = new EpisodeTrainer();
    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;

    public async train(qTable: Map<number, QTableRow>, n: number) {
        this.semaphoreId = Trainer.semaphore.enable();

        //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------

        EpisodeTrainer.experience.clear();

        const discount = 0.9;
        const learningRate = 0.1;
        const lessons = await StateProducer.getStateProducersFromJson();

        const episodeRunnerF = async (stateProducer: StateProducer, trainerInfo: string): Promise<void> => {
            await this.episodeTrainer.train(stateProducer, qTable, discount, learningRate, trainerInfo, this.semaphoreId);
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
