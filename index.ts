import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import Anthropic from "@anthropic-ai/sdk";

type Command = {
  role: "system" | "user";
  message: string;
};

type Task = {
  context: string[];
  type: "new" | "update";
  name: string;
  commands: Array<Command[]>;
};

type ContextContents = Record<string, string>;

const BASE_DIR = "./example";
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-opus-20240229";

// Initialize the Anthropic client
const client = new Anthropic({
  apiKey: API_KEY, // This is the default and can be omitted
});

/**
 * Reads the contents of specified files and returns them as an object.
 * @param fileNames - An array of file names to read.
 * @returns A promise that resolves to an object containing file contents.
 * @throws Error if a required file does not exist.
 */
async function getContextFileContents(fileNames: string[]): Promise<ContextContents> {
  const contents: ContextContents = {};
  for (const file of fileNames) {
    const filePath = join(BASE_DIR, file);
    try {
      contents[file] = await readFile(filePath, "utf8");
    } catch (error) {
      throw new Error(`Required file ${file} does not exist.`);
    }
  }
  return contents;
}

/**
 * Converts context contents to system commands for the AI.
 * @param contextContents - An object containing context file contents.
 * @returns An array of Command objects formatted for the AI system.
 */
function convertToSystemCommands(contextContents: ContextContents): Command[] {
  return Object.entries(contextContents).map(([key, value]) => ({
    role: "system",
    content: `<context_${key}>${value}</context_${key}>`,
    cache_control: {"type": "ephemeral"}
  }));
}

/**
 * Queries the AI model using the Anthropic SDK.
 * @param task - The task object containing commands for the AI.
 * @param contextContent - The context content for the AI query.
 * @returns A promise that resolves to the AI's response as a string.
 */
async function queryAI(task: Task, contextContent: ContextContents): Promise<string> {
  const system_context = convertToSystemCommands(contextContent)
  const response = await client.messages.create({
    model: MODEL,
    system: [...system_context],
    messages: task.commands
  });

  return response.content;
}

/**
 * Processes a list of tasks, handling dependencies and file operations.
 * @param tasks - An array of Task objects to process.
 * @returns A promise that resolves when all tasks are processed.
 * @throws Error if a required file or dependency is missing.
 */
export async function processTasks(tasks: Task[]): Promise<void> {
  const fileStatus: Record<string, "processing" | "done" | undefined> = {};

  // Pre-initialize all context files in `fileStatus`
  for (const task of tasks) {
    for (const file of task.context) {
      if (!fileStatus[file]) {
        try {
          await readFile(join(BASE_DIR, file), "utf8");
          fileStatus[file] = "done";
        } catch {
          throw new Error(`Required file ${file} does not exist.`);
        }
      }
    }
  }

  for (const task of tasks) {
    // Ensure all required context files are processed before starting the task
    for (const file of task.context) {
      while (fileStatus[file] === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for dependencies
      }
      if (!fileStatus[file]) {
        throw new Error(`Dependency file ${file} has not been processed yet.`);
      }
    }

    fileStatus[task.name] = "processing";

    try {
      const contextContent = await getContextFileContents(task.context);
      const result = await queryAI(task, contextContent);
      const outputPath = join(BASE_DIR, task.name);
      await writeFile(outputPath, result, "utf8");
      fileStatus[task.name] = "done";
    } catch (error) {
      console.error(`Error processing task for file ${task.name}: ${error.message}`);
      fileStatus[task.name] = undefined;
    }
  }
}
