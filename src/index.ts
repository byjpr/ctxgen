// index.ts
import { AIClient } from "./ai";
import { getContextFileContents, writeOutputFile } from "./fileUtils";
import type { Task } from "./types";
import { TaskQueue } from "./taskQueue";
import { config } from "./config";
import logger from "./logger";
import { FileNotFoundError, DependencyError, AIQueryError } from "./errors";

export async function processTasks(tasks: Task[]): Promise<void> {
  const taskQueue = new TaskQueue();
  const aiClient = new AIClient(config.ANTHROPIC_API_KEY);

  // Add tasks to the queue
  for (const task of tasks) {
    taskQueue.addTask(task);
  }

  const callBeforeFunction = async (task: Task): Promise<Task> => {
    if (typeof task.before === 'function') {
      return task.before(task);
    }
    return task;
  };

  await taskQueue.run(async (task: Task) => {
    try {
      task = await callBeforeFunction(task);

      const contextContent = await getContextFileContents(task.context);
      const result = await aiClient.queryAI(task, contextContent);
      await writeOutputFile(task.name, result);
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        logger.error(`File not found: ${error.message}`);
      } else if (error instanceof DependencyError) {
        logger.error(`Dependency error: ${error.message}`);
      } else if (error instanceof AIQueryError) {
        logger.error(`AI query error: ${error.message}`);
      } else {
        logger.error(`Unexpected error processing task ${task.name}: ${error.message}`);
      }
      throw error; // Re-throw to mark task as failed in the queue
    }
  });
}
