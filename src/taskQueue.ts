// taskQueue.ts
import type { Task } from './types';
import logger from './logger';

export class TaskQueue {
  private queue: Task[] = [];
  private running: Set<string> = new Set();
  private completed: Set<string> = new Set();

  addTask(task: Task) {
    this.queue.push(task);
  }

  async run(processTask: (task: Task) => Promise<void>) {
    while (this.queue.length > 0) {
      const readyTasks = this.queue.filter(task =>
        task.context.every(dep => this.completed.has(dep)));

      await Promise.all(readyTasks.map(async task => {
        this.running.add(task.name);
        logger.info(`Starting task: ${task.name}`);
        try {
          await processTask(task);
          this.completed.add(task.name);
          logger.info(`Completed task: ${task.name}`);
        } catch (error) {
          logger.error(`Error processing task ${task.name}: ${error.message}`);
        } finally {
          this.running.delete(task.name);
          this.queue = this.queue.filter(t => t !== task);
        }
      }));

      if (readyTasks.length === 0 && this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}
