import { TesterEntryPoint } from './Tester';
import { Semaphore } from '../utils/Semaphore';
import { LessonProducer } from '../environment/LessonProducer';
import { EpisodeRunner as EpisodeTrainer } from './EpisodeTrainer';
import { ConfigurationLoader } from '../configuration/ConfigLoader';

export class Trainer {

    private episodeTrainer: EpisodeTrainer = new EpisodeTrainer();
    public static semaphore: Semaphore = new Semaphore();
    private semaphoreId: number | null = null;
    private tester: TesterEntryPoint | null = null;

    public async train(): Promise<void> {
        this.semaphoreId = Trainer.semaphore.enable();

        //-------------some hack------------
        if (!Trainer.semaphore.goodToGo(this.semaphoreId)) return;
        //----------------------------------
        await this.runTester();
        EpisodeTrainer.experience.clear();

        const configuration = await ConfigurationLoader.getConfiguration();
        const trainerConfig = configuration.trainerConfiguration;
        const discount = trainerConfig?.discount ?? 0.9;
        const learningRate = trainerConfig?.learningRate ?? 0.1;
        const trainingBachCount = trainerConfig?.trainingBatchCount ?? 10;
        const lessons = await LessonProducer.getLessonProducersFromJson();

        const episodeRunnerF = async (stateProducer: LessonProducer, trainerInfo: string): Promise<void> =>
            await this.episodeTrainer.train(stateProducer, discount, learningRate, trainerInfo, this.semaphoreId);

        const stateProducerConsumer = async (stateProducer: LessonProducer, lessonInfo: string, trainerInfo: string): Promise<void> => {
            let episodesCount = stateProducer.getEpisodesToTrain();
            for (let episode = 0; episode < episodesCount; episode++) {
                let infoMessage = lessonInfo + 'Episode: ' + (episode + 1) + ' of ' + episodesCount + '\n' + trainerInfo;
                await episodeRunnerF(stateProducer, infoMessage);
            }
        };

        for (let i = 0; i < trainingBachCount; i++) {
            for (let lessonNb = 0; lessonNb < lessons.length; lessonNb++) {
                let lesson = lessons[lessonNb];
                let lessonInfo = 'Lesson: ' + (lessonNb + 1) + ' of ' + lessons.length + '.\n';
                let trainerInfo = 'Running training batch: ' + (i + 1) + ' of ' + trainingBachCount;
                await stateProducerConsumer(lesson, lessonInfo, trainerInfo);
            }
        }
    }


    private async runTester() {
        this.tester = new TesterEntryPoint();
        await this.tester.test(false);
    }

    public stop(): void {
        Trainer.semaphore.stop();
        this.tester?.stop();
        this.tester = null;
    }
}

