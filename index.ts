import {processTasks} from "./src/index"
import type {Task, Command} from "./src/types"

const tasks: Task[] = [
    { name: 'prd', type: "new", context: [], commands: [] },
    { name: 'brd', type: "new", context: ['task1'], commands: [] },
    { name: 'dbrd', type: "new", context: ['task2'], commands: [] },
    { name: 'drd', type: "new", context: ['task2'], commands: [] },
    { name: 'frd', type: "new", context: ['task2'], commands: [] },
    { name: 'postgres', type: "new", context: ['task2'], commands: [] },
    { name: 'schema', type: "new", context: ['task2'], commands: [] }
];
