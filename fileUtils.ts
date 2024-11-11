import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { BASE_DIR } from "./config";
import type { ContextContents } from "./types";

export async function getContextFileContents(fileNames: string[]): Promise<ContextContents> {
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

export async function writeOutputFile(fileName: string, content: string): Promise<void> {
  const outputPath = join(BASE_DIR, fileName);
  await writeFile(outputPath, content, "utf8");
}
