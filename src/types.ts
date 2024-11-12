export type Command = {
  role: "system" | "user";
  message: string;
};

export type Task = {
  context: string[];
  type: "new" | "update";
  name: string;
  commands: Array<Command[]>;
  before: Function;
};

export type ContextContents = Record<string, string>;
