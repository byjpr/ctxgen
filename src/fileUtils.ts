import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import config from "./config";
import type { Task, ContextContents } from "./types";

export async function getTaskContextContents(task: Task): Promise<ContextContents> {
  const fileNames: string[] = task.context;

  if(task.type = "update") {
    fileNames.push(task.name);
  }

  return await readContextFiles(fileNames)
}

export async function readContextFiles(fileNames: string[]): Promise<ContextContents> {
  const contents: ContextContents = {};
  for (const file of fileNames) {
    const filePath = join(config.BASE_DIR, file);
    try {
      contents[file] = await readFile(filePath, "utf8");
    } catch (error) {
      throw new Error(`Required file ${file} does not exist.`);
    }
  }
  return contents;
}

export async function writeOutputFile(fileName: string, content: string): Promise<void> {
  const outputPath = join(config.OUTPUT_DIR, fileName);
  await writeFile(outputPath, content, "utf8");
}
