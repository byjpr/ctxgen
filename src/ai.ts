import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import type { Task, ContextContents } from "./types";

export class AIClient {
  private client: Anthropic;

  constructor(apiKey: string = config.API_KEY) {
    this.client = new Anthropic({ apiKey });
  }

  private defaultBridge(obj) {
    return this.client.messages.create(obj);
  }

  private convertToSystemCommands(contextContents: ContextContents) {
    return Object.entries(contextContents).map(([key, value]) => ({
      role: "system",
      content: `<context_${key}>${value}</context_${key}>`,
      cache_control: {"type": "ephemeral"}
    }));
  }

  async queryAI(task: Task, contextContent: ContextContents, ai = this.defaultBridge): Promise<string> {
    const system_context = this.convertToSystemCommands(contextContent);
    const system_command = task.commands.flat().filter(cmd => cmd.role === "system").join();
    const user_commands = task.commands.flat().filter(cmd => cmd.role === "user");

    const response = await ai({
      model: config.ANTHROPIC_MODEL,
      system: system_command,
      messages: [...system_context, user_commands]
    });§

    return response;
  }
}
