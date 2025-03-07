// index.ts
import { AIClient } from "./ai";
import { getTaskContextContents, writeOutputFile } from "./fileUtils";
import type { Task } from "./types";
import { TaskQueue } from "./taskQueue";
import config from "./config";
import logger from "./logger";
import { FileNotFoundError, DependencyError, AIQueryError } from "./errors";

export async function processTasks(tasks: Task[]): Promise<void> {
  const taskQueue = new TaskQueue(logger);
  const aiClient = new AIClient(config.ANTHROPIC_API_KEY);

  // Add tasks to the queue
  for (const task of tasks) {
    taskQueue.addTask(task);
  }

  await taskQueue.run(async (task: Task) => {
    try {
      if(task.type == "ack") {
        logger.info(`Acknowledged task: ${task.name}`);
      } else {
        const contextContent = await getTaskContextContents(task);
        const result = await aiClient.queryAI(task, contextContent);
        await writeOutputFile(task.name, result);
      }
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        logger.error(`File not found: ${error.message}`, error);
      } else if (error instanceof DependencyError) {
        logger.error(`Dependency error: ${error.message}`, error);
      } else if (error instanceof AIQueryError) {
        logger.error(`AI query error: ${error.message}`, error);
      } else {
        logger.error(`Unexpected error processing task ${task.name}: ${error.message}`, error);

        console.log(error.stack)
      }
      throw error; // Re-throw to mark task as failed in the queue
    }
  });
}
