export type Command = {
  role: "system" | "user";
  message: string;
};

export type Task = {
  context: string[];
  type: "new" | "update";
  name: string;
  commands: Array<Command[]>;
};

export type ContextContents = Record<string, string>;
