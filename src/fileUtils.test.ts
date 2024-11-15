import { test, expect, mock, jest } from "bun:test";
import { getContextFileContents, writeOutputFile } from "./fileUtils";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import config from "./config";

// Mock fs/promises
mock.module("fs/promises", () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock path
mock.module("path", () => ({
  join: (...args: string[]) => args.join("/"),
}));

test("getContextFileContents reads files correctly", async () => {
  const mockContent = "file content";
  (readFile as any).mockImplementation(() => Promise.resolve(mockContent));

  const fileNames = ["file1.txt", "file2.txt"];
  const result = await getContextFileContents(fileNames);

  expect(result).toEqual({
    "file1.txt": mockContent,
    "file2.txt": mockContent,
  });

  expect(readFile).toHaveBeenCalledTimes(2);
  expect(readFile).toHaveBeenCalledWith(`${config.BASE_DIR}/file1.txt`, "utf8");
  expect(readFile).toHaveBeenCalledWith(`${config.BASE_DIR}/file2.txt`, "utf8");
});

test("getContextFileContents throws error for non-existent file", async () => {
  (readFile as any).mockImplementation(() => Promise.reject(new Error("File not found")));

  const fileNames = ["nonexistent.txt"];

  await expect(getContextFileContents(fileNames)).rejects.toThrow(
    "Required file nonexistent.txt does not exist."
  );
});

test("writeOutputFile writes file correctly", async () => {
  const fileName = "output.txt";
  const content = "Hello, World!";

  await writeOutputFile(fileName, content);

  expect(writeFile).toHaveBeenCalledTimes(1);
  expect(writeFile).toHaveBeenCalledWith(`${config.BASE_DIR}/output.txt`, content, "utf8");
});

test("writeOutputFile handles errors", async () => {
  (writeFile as any).mockImplementation(() => Promise.reject(new Error("Write error")));

  const fileName = "error.txt";
  const content = "Error content";

  await expect(writeOutputFile(fileName, content)).rejects.toThrow("Write error");
});
