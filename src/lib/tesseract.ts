import { createWorker, Worker, WorkerOptions } from "tesseract.js";

export async function createTesseractWorker(options: Partial<WorkerOptions>) {
  const worker = await createWorker(options);
  return worker;
}

export async function recognize(
  worker: Worker,
  imageLike: Tesseract.ImageLike,
  onStartJob: (jobId: string) => void,
  onCompleteJob: (jobId: string, text: string) => void
) {
  const workerResult = await worker.load();
  try {
    onStartJob(workerResult.jobId);
    await worker.loadLanguage("jpn");
    await worker.initialize("jpn");

    const {
      data: { text },
    } = await worker.recognize(imageLike);
    await worker.terminate();

    onCompleteJob(workerResult.jobId, text.replace(/\s/g, ""));
  } catch (e) {
    throw { jobId: workerResult.jobId, error: e };
  }
}
