import { readFile, writeFile } from "fs/promises";
import { join } from "path";

type Command = {
  type: "system" | "user";
  message: string;
};

type Task = {
  context: string[];
  type: "new" | "update";
  name: string;
  commands: Command[];
};

type ContextContents = Record<string, string>;

const API_ENDPOINT = "https://abstractapi.example.com/ai-query";
const BASE_DIR = "./example";

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

async function queryAI(task: Task, contextContent: ContextContents): Promise<string> {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: contextContent,
      commands: task.commands,
    }),
  });
  const data = await response.json();
  return data.result;
}

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
