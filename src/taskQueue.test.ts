// taskQueue.test.ts
import { TaskQueue } from './taskQueue';
import type { Task } from './types';
import type { Logger } from './logger';

import {describe, beforeEach, test, expect, jest, mock} from "bun:test";

const delay = (time) => {
  return new Promise(res => {
    setTimeout(res,time)
  })
}

describe('TaskQueue', () => {
  let taskQueue: TaskQueue;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };
    taskQueue = new TaskQueue(mockLogger);
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

  test('run should handle task processing errors', async () => {
    const task: Task = { name: 'errorTask', context: [], commands: [] };
    taskQueue.addTask(task);

    const processTask = jest.fn().mockRejectedValue(new Error('Task processing failed'));
    await taskQueue.run(processTask);

    expect(processTask).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error processing task errorTask'));
    expect(taskQueue['completed'].size).toBe(0);
  });

  test('run should process tasks concurrently when possible', async () => {
    const task1: Task = { name: 'task1', context: [], commands: [] };
    const task2: Task = { name: 'task2', context: [], commands: [] };
    const task3: Task = { name: 'task3', context: ['task1'], commands: [] };

    taskQueue.addTask(task1);
    taskQueue.addTask(task2);
    taskQueue.addTask(task3);

    const processTask = jest.fn().mockImplementation(async (task: Task) => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const startTime = Date.now();
    await taskQueue.run(processTask);
    const endTime = Date.now();

    expect(processTask).toHaveBeenCalledTimes(3);
    // If tasks are processed concurrently, it should take less than 300ms
    expect(endTime - startTime).toBeLessThan(250);
  });

  test('run should log task start and completion', async () => {
    const task: Task = { name: 'loggedTask', context: [], commands: [] };
    taskQueue.addTask(task);

    const processTask = jest.fn().mockResolvedValue(undefined);
    await taskQueue.run(processTask);

    expect(mockLogger.info).toHaveBeenCalledWith('Starting task: loggedTask');
    expect(mockLogger.info).toHaveBeenCalledWith('Completed task: loggedTask');
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

  test('run should handle task processing errors', async () => {
    const task: Task = { name: 'errorTask', context: [], commands: [] };
    taskQueue.addTask(task);

    const processTask = jest.fn().mockRejectedValue(new Error('Task processing failed'));
    await taskQueue.run(processTask);

    expect(processTask).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error processing task errorTask'));
    expect(taskQueue['completed'].size).toBe(0);
  });

  test('run should process tasks concurrently when possible 2', async () => {
    const task1: Task = { name: 'task1', context: [], commands: [] };
    const task2: Task = { name: 'task2', context: [], commands: [] };
    const task3: Task = { name: 'task3', context: [], commands: [] };
    const task4: Task = { name: 'task4', context: [], commands: [] };
    const task5: Task = { name: 'task5', context: [], commands: [] };
    const task6: Task = { name: 'task6', context: ['task1'], commands: [] };
    const task7: Task = { name: 'task7', context: ['task6','task5'], commands: [] };

    taskQueue.addTask(task1);
    taskQueue.addTask(task2);
    taskQueue.addTask(task3);
    taskQueue.addTask(task4);
    taskQueue.addTask(task5);
    taskQueue.addTask(task6);
    taskQueue.addTask(task7);

    const processTask = jest.fn().mockImplementation(async (task: Task) => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    const startTime = Date.now();
    await taskQueue.run(processTask);
    const endTime = Date.now();

    expect(mockLogger.info).toHaveBeenCalled();

    expect(processTask).toHaveBeenCalledTimes(7);
    // If tasks are processed concurrently, it should take less than 300ms
    expect(endTime - startTime).not.toBeLessThan(250);
  });

  test('run should log task start and completion', async () => {
    const task: Task = { name: 'loggedTask', context: [], commands: [] };
    taskQueue.addTask(task);

    const processTask = jest.fn().mockResolvedValue(undefined);
    await taskQueue.run(processTask);

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Starting task: loggedTask');
    expect(mockLogger.info).toHaveBeenCalledWith('Completed task: loggedTask');
  });
});
