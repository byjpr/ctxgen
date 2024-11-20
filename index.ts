import { processTasks } from "./src/index";
import type { Task, Command } from "./src/types";

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
  }
//   {
//     name: 'brd',
//     type: "new",
//     context: ['about', 'prd', 'frd', 'drd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/brd.js
//     commands: [
//         { role: "system", content: await Bun.file("./system-prompts/app/brd.md").text() },
//         { role: "user", content: `determine the backend specifications in terms of whether the backend needs a REST API , and whether it needs realtime Websockets.
// your answer should start with : \`\`\`yaml

// you are a genius` }
//     ]
//   },
//   {
//     name: 'drd',
//     type: "new",
//     context: ['about', 'prd', 'frd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/drd.js
//     commands: [
//         { role: "system", content: await Bun.file("./system-prompts/app/dbrd.md").text() },
//         { role: "user", content: `Conduct a comprehensive analysis for the DB Requirements Document that considers all personas and features required, in markdown format (justify your reasoning whenever possible)

// you're a genius` }
//     ]
//   },
//   {
//     name: 'frd',
//     type: "new",
//     context: ['about', 'prd'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/pm/frd.js
//     commands: [
//         { role: "system", content: await Bun.file("./system-prompts/app/frd.md").text() },
//         { role: "user", content: `implement the Features Requirements Document (FRD)
// you're a genius` }
//     ]
//   },
//   {
//     name: 'postgres',
//     type: "new",
//     context: ['about', 'drd', 'schema'], // https://github.com/raidendotai/cofounder/blob/main/cofounder/api/system/functions/db/postgres.js
//     commands: [
//         { role: "system", content: await Bun.file("./system-prompts/app/postgres.md").text() },
//         { role: "user", content: `Generate the POSTGRES command in one single comprehensive answer
// it is expected to be very comprehensive and detailed and cover all the provided details

// ---

// very important :
//  > avoid any postgres-hardcoded methods ie. for generating UIDs etc... or similar ; logic for that stuff will come from nodejs functions !
//  > do not generate UUIDs or similar inside postgres ! that stuff will come from nodejs functions !
//  > in case of UUIDs, make them normal strings and not generated inside postgres by postgres methods !


// > aim for it to work on any default light postgres without any extra configs or plugins !
// > only use basic primitives like numbers, strings, json, etc ... no uuid types or special types etc
// > very important : only use basic primitives like numbers, strings, json, etc ... no uuid types or any special types etc ! very basic primitives only !

// reply in \`\`\`postgresql\`\`\`

// you're a genius` }
//     ]
//   },
//   {
//     name: 'schema',
//     type: "new",
//     context: ['about', 'drd', 'prd'],
//     commands: [
//         { role: "system", content: await Bun.file("./system-prompts/app/schema.md").text() },
//         { role: "user", content: `Design the DB schemas in a comprehensive answer
// it is expected to be very comprehensive and detailed ; in a VALID PARSEABLE YAML format

// very important :
// - avoid any postgres-hardcoded methods ie. for generating UIDs etc... make them normal strings
// - logic for that stuff will come from nodejs functions !
// - only use basic primitives like numbers, strings, json, etc ... no uuid types or special types etc
// - very important : only use basic primitives like numbers, strings, json, etc ... no uuid types or any special types etc ! very basic primitives only !

// you're a genius` }
//     ]
//   }
];

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
  // Now you can use tasks, all promises are resolved
  // console.log(JSON.stringify(tasks, null, 2));
  // Or pass to processTasks
  await processTasks(tasks);
}

main().catch(console.error);
