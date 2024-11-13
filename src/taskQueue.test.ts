// taskQueue.test.ts
import { TaskQueue } from './taskQueue';
import type { Task } from './types';
import logger from './logger';

import {describe, beforeEach, test, expect, jest, mock} from "bun:test";

// Mock the logger
mock('./logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('TaskQueue', () => {
  let taskQueue: TaskQueue;

  beforeEach(() => {
    taskQueue = new TaskQueue();
    jest.clearAllMocks();
  });

  test('addTask should add a task to the queue', () => {
    const task: Task = { name: 'testTask', context: [], commands: [] };
    taskQueue.addTask(task);
    expect(taskQueue['queue']).toHaveLength(1);
    expect(taskQueue['queue'][0]).toBe(task);
  });

  test('run should process tasks in order', async () => {
    const task1: Task = { name: 'task1', context: [], commands: [] };
    const task2: Task = { name: 'task2', context: [], commands: [] };
    taskQueue.addTask(task1);
    taskQueue.addTask(task2);

    const processTask = jest.fn().mockResolvedValue(undefined);
    await taskQueue.run(processTask);

    expect(processTask).toHaveBeenCalledTimes(2);
    expect(processTask).toHaveBeenNthCalledWith(1, task1);
    expect(processTask).toHaveBeenNthCalledWith(2, task2);
  });

  test('run should respect task dependencies', async () => {
    const task1: Task = { name: 'task1', context: [], commands: [] };
    const task2: Task = { name: 'task2', context: ['task1'], commands: [] };
    const task3: Task = { name: 'task3', context: ['task2'], commands: [] };

    taskQueue.addTask(task3);
    taskQueue.addTask(task2);
    taskQueue.addTask(task1);

    const processedTasks: string[] = [];
    const processTask = jest.fn().mockImplementation(async (task: Task) => {
      processedTasks.push(task.name);
    });

    await taskQueue.run(processTask);

    expect(processedTasks).toEqual(['task1', 'task2', 'task3']);
  });

  test('run should remove completed tasks from the queue', async () => {
    const task: Task = { name: 'completedTask', context: [], commands: [] };
    taskQueue.addTask(task);

    const processTask = jest.fn().mockResolvedValue(undefined);
    await taskQueue.run(processTask);

    expect(taskQueue['queue']).toHaveLength(0);
    expect(taskQueue['completed'].has('completedTask')).toBe(true);
  });

  test('run should wait when no tasks are ready', async () => {
    const task1: Task = { name: 'task1', context: ['nonexistent'], commands: [] };
    taskQueue.addTask(task1);

    const processTask = jest.fn().mockResolvedValue(undefined);

    // We'll use a timeout to stop the run method after a short time
    setTimeout(() => {
      taskQueue['queue'] = [];
    }, 300);

    await taskQueue.run(processTask);

    expect(processTask).not.toHaveBeenCalled();
  });
});
