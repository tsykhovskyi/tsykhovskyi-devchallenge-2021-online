export interface StartCommand {
  command: "START";
}

export interface GoToCommand {
  command: "GOTO";
  x: number;
  y: number;
}

export interface DownCommand {
  command: "DOWN";
}

export interface UpCommand {
  command: "UP";
}

export interface StopCommand {
  command: "STOP";
}

export type Command =
  | StartCommand
  | GoToCommand
  | DownCommand
  | UpCommand
  | StopCommand;

export interface Coordinates {
  x: number;
  y: number;
}
