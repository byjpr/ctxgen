import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import type { Task, ContextContents } from "./types";

export class AIClient {
  private client: Anthropic;

  constructor(apiKey: string = config.API_KEY) {
    this.client = new Anthropic({ apiKey });
  }

  private convertToSystemCommands(contextContents: ContextContents) {
    return Object.entries(contextContents).map(([key, value]) => ({
      role: "system",
      content: `<context_${key}>${value}</context_${key}>`,
      cache_control: {"type": "ephemeral"}
    }));
  }

  async queryAI(task: Task, contextContent: ContextContents): Promise<string> {
    const system_context = this.convertToSystemCommands(contextContent);
    const system_commands = task.commands.flat().filter(cmd => cmd.role === "system");
    const user_commands = task.commands.flat().filter(cmd => cmd.role === "user");

    const response = await this.client.messages.create({
      model: config.ANTHROPIC_MODEL,
      system: [...system_commands, ...system_context],
      messages: user_commands
    });

    return response.content;
  }
}
