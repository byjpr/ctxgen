import Anthropic from "@anthropic-ai/sdk";
import config from "./config";
import type { Task, ContextContents } from "./types";

export class AIClient {
  private client: Anthropic;

  constructor(apiKey: string = config.API_KEY) {
    this.client = new Anthropic({ apiKey, promptCachingBeta: true });
  }

  private convertToSystemContext(contextContents: ContextContents) {
    return Object.entries(contextContents).map(([key, value]) => ({
      type: "text",
      text: `<context_${key}>${value}</context_${key}>`,
      cache_control: {
        type: 'ephemeral'
      }
    }));
  }


  private convertToSystemCommands(contextContents) {
    return Object.entries(contextContents).map(([key, value]) => ({
      type: "text",
      text: value.content
    }));
  }


  async queryAI(task: Task, contextContent: ContextContents): Promise<string> {
    const system_context = this.convertToSystemContext(contextContent);

    const system_command = Array.isArray(task.commands)
      ? this.convertToSystemCommands(task.commands.flat().filter(cmd => cmd && cmd.role === "system")) || null
      : null;

    const user_commands = Array.isArray(task.commands)
      ? task.commands.flat().filter(cmd => cmd && cmd.role === "user")
      : [];

    const ai_object = {
      betas: ['prompt-caching-2024-07-31'],
      model: config.ANTHROPIC_MODEL,
      max_tokens: 8192,
      system: [...system_command, ...system_context],
      messages: [...user_commands]
    }

    const response = await this.client.beta.messages.create(ai_object);

    return response.content[0].text;
  }
}
