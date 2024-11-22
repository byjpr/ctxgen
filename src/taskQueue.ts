// taskQueue.ts
import type { Task } from './types';
import type { Logger } from './logger';

export class TaskQueue {
  private queue: Task[] = [];
  private running: Set<string> = new Set();
  private completed: Set<string> = new Set();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  addTask(task: Task) {
    this.queue.push(task);
  }

  private async maybeCallBeforeFunction(task: Task): Promise<Task> {
    if (typeof task.before === 'function') {
      return task.before(task);
    }
    return task;
  }

  async run(processTask: (task: Task) => Promise<void>) {
    while (this.queue.length > 0) {
      const readyTasks = this.queue.filter(task =>
        task.context.every(dep => this.completed.has(dep)));

      await Promise.all(readyTasks.map(async task => {
        this.running.add(task.name);
        this.logger.info(`Starting task: ${task.name}`);
        try {
          task = await this.maybeCallBeforeFunction(task);
          await processTask(task);
          this.completed.add(task.name);
          this.logger.info(`Completed task: ${task.name}`);
        } catch (error) {
          this.logger.error(`Error processing task ${task.name}: ${error.message}`);
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

  getDependencyTree(): Record<string, { dependencies: string[] }> {
    const tree: Record<string, { dependencies: string[] }> = {};

    for (const task of this.queue) {
      tree[task.name] = {
        dependencies: task.context
      };
    }

    return tree;
  }
}
