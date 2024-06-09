import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
  const { problemId, userId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  /*  
      Here you would add your actual processing logic
      Simulating 1000ms delay using setTimeout for now
  */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}`);
}

interface Submission {
  element: any;
}

async function startWorker() {
  try {
    await client.connect();
    while (true) {
      const submission: Submission | null = (await client.brPop(
        "submissions",
        0
      )) as unknown as Submission;
      console.log(submission.element);
      await processSubmission(submission.element);
    }
  } catch (error) {
    console.log(`Failed to connect to Redis, ${error}`);
  }
}

startWorker();
