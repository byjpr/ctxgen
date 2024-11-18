import { processTasks } from "./src/index";
import type { Task, Command } from "./src/types";

const tasks: Task[] = [
  {
    name: 'prd',
    type: "new",
    context: [],
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/prd.md").text() }
    ]
  },
  {
    name: 'brd',
    type: "new",
    context: ['prd', 'frd', 'drd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/brd.js
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/brd.md").text() }
    ]
  },
  {
    name: 'drd',
    type: "new",
    context: ['prd', 'frd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/drd.js
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/dbrd.md").text() }
    ]
  },
  {
    name: 'frd',
    type: "new",
    context: ['prd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/frd.js
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/frd.md").text() }
    ]
  },
  {
    name: 'postgres',
    type: "new",
    context: ['drd', 'schema'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/db/postgres.js
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/postgres.md").text() }
    ]
  },
  {
    name: 'schema',
    type: "new",
    context: ['drd', 'prd'],
    commands: [
        { role: "system", message: await Bun.file("./system-prompts/app/schema.md").text() },
        { role: "user", message: `Design the DB schemas in a comprehensive answer
it is expected to be very comprehensive and detailed ; in a VALID PARSEABLE YAML format

very important :
- avoid any postgres-hardcoded methods ie. for generating UIDs etc... make them normal strings
- logic for that stuff will come from nodejs functions !
- only use basic primitives like numbers, strings, json, etc ... no uuid types or special types etc
- very important : only use basic primitives like numbers, strings, json, etc ... no uuid types or any special types etc ! very basic primitives only !

you're a genius` }
    ]
  }
];

async function loadTasks(): Promise<Task[]> {
  const taskPromises: Promise<Task>[] = tasks.map(async (task) => ({
    ...task,
    commands: await Promise.all(task.commands.map(async (command) => ({
      ...command,
      message: await command.message
    })))
  }));

  return Promise.all(taskPromises);
}

// Usage
async function main() {
  const tasks = await loadTasks();
  // Now you can use tasks, all promises are resolved
  console.log(JSON.stringify(tasks, null, 2));
  // Or pass to processTasks
  // await processTasks(tasks);
}

main().catch(console.error);
