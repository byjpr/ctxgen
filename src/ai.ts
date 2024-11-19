import Anthropic from "@anthropic-ai/sdk";
import config from "./config";
import type { Task, ContextContents } from "./types";

export class AIClient {
  private client: Anthropic;

  constructor(apiKey: string = config.API_KEY) {
    this.client = new Anthropic({ apiKey });
  }

  private convertToSystemCommands(contextContents: ContextContents) {
    return Object.entries(contextContents).map(([key, value]) => ({
      role: "user",
      content: `<context_${key}>${value}</context_${key}>`
    }));
  }

  async queryAI(task: Task, contextContent: ContextContents): Promise<string> {
    const system_context = this.convertToSystemCommands(contextContent);

    const system_command = Array.isArray(task.commands)
      ? task.commands.flat().filter(cmd => cmd && cmd.role === "system")
      : [];

    const user_commands = Array.isArray(task.commands)
      ? task.commands.flat().filter(cmd => cmd && cmd.role === "user")
      : [];

    console.log(system_command)

    console.log(JSON.stringify({
      model: config.ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: system_command.content,
      messages: [...system_context, ...user_commands]
    }))

    const response = await this.client.messages.create({
      model: config.ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: system_command.content,
      messages: [...system_context, ...user_commands]
    });

    return response;
  }
}
