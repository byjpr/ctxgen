import { processTasks } from "../src/index";
import logger from "../src/logger";

import { TaskQueue } from "../src/taskQueue";
import type { Task } from "../src/types";

const tasks: Task[] = [
  {
    name: 'about',
    type: "ack",
    context: [],
    commands: []
  },
  {
    name: 'prd',
    type: "new",
    context: ['about'],
    commands: [
        { role: "system", content: await Bun.file("./system-prompts/app/prd.md").text() },
        { role: "user", content: `Conduct your analysis and make sure you do not miss any feature or detail !
you are a genius` }
    ]
  },
  {
    name: 'brd',
    type: "new",
    context: ['about', 'prd', 'frd', 'drd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/brd.js
    commands: [
        { role: "system", content: await Bun.file("./system-prompts/app/brd.md").text() },
        { role: "user", content: `determine the backend specifications in terms of whether the backend needs a REST API , and whether it needs realtime Websockets.
your answer should start with : \`\`\`yaml

you are a genius` }
    ]
  },
  {
    name: 'drd',
    type: "new",
    context: ['about', 'prd', 'frd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/drd.js
    commands: [
        { role: "system", content: await Bun.file("./system-prompts/app/dbrd.md").text() },
        { role: "user", content: `Conduct a comprehensive analysis for the DB Requirements Document that considers all personas and features required, in markdown format (justify your reasoning whenever possible)

you're a genius` }
    ]
  },
  {
    name: 'frd',
    type: "new",
    context: ['about', 'prd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/frd.js
    commands: [
        { role: "system", content: await Bun.file("./system-prompts/app/frd.md").text() },
        { role: "user", content: `implement the Features Requirements Document (FRD)
you're a genius` }
    ]
  },
];

const taskQueue = new TaskQueue(logger);

async function loadTasks(): Promise<Task[]> {
  const taskPromises: Promise<Task>[] = tasks.map(async (task) => ({
    ...task,
    commands: await Promise.all(task.commands.map(async (command) => ({
      ...command,
      content: await command.content
    })))
  }));

  return Promise.all(taskPromises);
}

// Usage
async function main() {
  const tasks = await loadTasks();

  // Add tasks to the queue
  for (const task of tasks) {
    taskQueue.addTask(task);
  }

  console.log(taskQueue.getDependencyTree());
}

main().catch(console.error);
