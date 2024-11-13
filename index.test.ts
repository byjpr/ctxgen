import { describe, it, expect, beforeEach, afterEach, vi } from "bun:test";
import { processTasks } from "./src/index"; // Update to your actual script path

// Mock `fs/promises` functions
const originalReadFile = Bun.readFile;
const originalWriteFile = Bun.writeFile;

describe("AI Query Script Tests", () => {
  it("should process a task to create a new file with AI-generated content", async () => {
    const tasks = [
      {
        context: ["dbrd.md", "frd.md"],
        type: "new",
        name: "prd.md",
        commands: [
          { type: "system", message: "System command for AI" },
          { type: "user", message: "Generate prd.md based on dbrd.md and frd.md" },
        ],
      },
    ];

    await processTasks(tasks);

    expect(globalThis.fetch).toHaveBeenCalled();
    expect(globalThis.writeFile).toHaveBeenCalledWith(
      "prd.md",
      "Generated content based on dbrd.md, frd.md",
      "utf8"
    );
  });

  it("should wait for dependencies to complete before processing", async () => {
    const tasks = [
      {
        context: ["dbrd.md", "frd.md"],
        type: "new",
        name: "prd.md",
        commands: [{ type: "user", message: "Generate prd.md based on dbrd.md and frd.md" }],
      },
      {
        context: ["prd.md"],
        type: "update",
        name: "prd.md",
        commands: [{ type: "user", message: "Update prd.md with additional info" }],
      },
    ];

    await processTasks(tasks);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(globalThis.writeFile).toHaveBeenNthCalledWith(
      1,
      "prd.md",
      "Generated content based on dbrd.md, frd.md",
      "utf8"
    );
    expect(globalThis.writeFile).toHaveBeenNthCalledWith(
      2,
      "prd.md",
      "Generated content based on prd.md",
      "utf8"
    );
  });

  it("should handle multiple independent tasks in parallel", async () => {
    const tasks = [
      {
        context: ["dbrd.md"],
        type: "new",
        name: "file1.md",
        commands: [{ type: "user", message: "Generate file1 based on dbrd.md" }],
      },
      {
        context: ["frd.md"],
        type: "new",
        name: "file2.md",
        commands: [{ type: "user", message: "Generate file2 based on frd.md" }],
      },
    ];

    await processTasks(tasks);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(globalThis.writeFile).toHaveBeenCalledWith(
      "file1.md",
      "Generated content based on dbrd.md",
      "utf8"
    );
    expect(globalThis.writeFile).toHaveBeenCalledWith(
      "file2.md",
      "Generated content based on frd.md",
      "utf8"
    );
  });

  it("should throw an error if a required context file is missing", async () => {
    const tasks = [
      {
        context: ["missing.md"],
        type: "new",
        name: "result.md",
        commands: [{ type: "user", message: "Generate result based on missing.md" }],
      },
    ];

    await expect(processTasks(tasks)).rejects.toThrow("Required file missing.md does not exist");
  });

  it("should handle an API error and retry if necessary", async () => {
    let fetchCallCount = 0;
    globalThis.fetch = vi.fn(async () => {
      fetchCallCount++;
      if (fetchCallCount === 1) throw new Error("API Error");
      return {
        json: async () => ({ result: "Generated content after retry" }),
      };
    });

    const tasks = [
      {
        context: ["dbrd.md"],
        type: "new",
        name: "retryFile.md",
        commands: [{ type: "user", message: "Generate retryFile based on dbrd.md" }],
      },
    ];

    await processTasks(tasks);

    expect(fetchCallCount).toBe(2);
    expect(globalThis.writeFile).toHaveBeenCalledWith(
      "retryFile.md",
      "Generated content after retry",
      "utf8"
    );
  });
});
