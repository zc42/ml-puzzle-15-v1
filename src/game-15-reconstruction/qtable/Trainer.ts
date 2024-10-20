import { Utils } from '../utils/Utils';
import { QTableRow } from './QTableRow';
import { Semaphore } from '../utils/Semaphore';
import { StateProducer } from '../lessons/StateProducer';
import { EpisodeRunner as EpisodeTrainer } from './EpisodeTrainer';
import { ShadowTester } from './ShadowTester';

export class Trainer {

    private episodeTrainer: EpisodeTrainer = new EpisodeTrainer();
    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;
    private shadowTesterIntervalId: number | null = null;

    public async train(qTable: Map<number, QTableRow>, n: number) {
        this.semaphoreId = Trainer.semaphore.enable();

        //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------
        await this.runShadowTester();
        EpisodeTrainer.experience.clear();

        const discount = 0.9;
        const learningRate = 0.1;
        const lessons = await StateProducer.getStateProducersFromJson();

        const episodeRunnerF = async (stateProducer: StateProducer, trainerInfo: string): Promise<void> => {
            await this.episodeTrainer.train(stateProducer, qTable, discount, learningRate, trainerInfo, this.semaphoreId);
        };

        const stateProducerConsumer = async (stateProducer: StateProducer, lessonInfo: string, trainerInfo: string): Promise<void> => {
            let episodesCount = stateProducer.getEpisodesToTrain();
            for (let episode = 0; episode < episodesCount; episode++) {
                let infoMessage = lessonInfo + 'Episode: ' + (episode + 1) + ' of ' + episodesCount + '\n' + trainerInfo;
                await episodeRunnerF(stateProducer, infoMessage);
            }
        };

        for (let i = 0; i < n; i++) {
            for (let lessonNb = 0; lessonNb < lessons.length; lessonNb++) {
                let lesson = lessons[lessonNb];
                let lessonInfo = 'Lesson: ' + (lessonNb + 1) + ' of ' + lessons.length + '.\n';
                let trainerInfo = 'Running training batch: ' + (i + 1) + ' of ' + n;
                await stateProducerConsumer(lesson, lessonInfo, trainerInfo);
            }
        }
        Utils.prnt('training done');
    }

    private async runShadowTester() {
        const shadowTester = new ShadowTester();
        await shadowTester.init();
        shadowTester.makeMove();
        this.shadowTesterIntervalId = setInterval(() => shadowTester.makeMove(), 500);
    }

    public stop(): void {
        Trainer.semaphore.stop();
        if (this.shadowTesterIntervalId !== null) {
            clearInterval(this.shadowTesterIntervalId);
            this.shadowTesterIntervalId = null;
        }
    }
}
