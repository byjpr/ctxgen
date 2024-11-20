export type Command = {
  role: "system" | "user";
  content: string;
};

export type Task = {
  context: string[];
  type: "new" | "update" | "ack";
  name: string;
  commands: Array<Command[]>;
  before?: Function;
};

export type ContextContents = Record<string, string>;
