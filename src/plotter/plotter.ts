import { Command, Coordinates, DownCommand, GoToCommand, StartCommand, StopCommand, UpCommand } from './models';

export class Plotter {
  private cutterPosition: Coordinates;
  private commands: Command[] = [];

  constructor(initCoordinates: Coordinates = {x: 0, y: 0}, private cutterIsActive = false) {
    this.cutterPosition = initCoordinates;
    this.start()
  }

  line(from : Coordinates, to: Coordinates) {
    if (this.coordinatesMatch(this.cutterPosition, from)) {
      this.activateCutter();
      this.goTo(to);
    } else if (this.coordinatesMatch(this.cutterPosition, to)) {
      this.activateCutter();
      this.goTo(from);
    } else {
      this.deactivateCutter();
      this.goTo(from);
      this.activateCutter();
      this.goTo(to);
    }
  }

  finish(): Command[] {
    this.stop();

    return this.commands;
  }

  private activateCutter() {
    if (!this.cutterIsActive) {
      this.down();
      this.cutterIsActive = true;
    }
  }

  private deactivateCutter() {
    if (this.cutterIsActive) {
      this.up();
      this.cutterIsActive = false;
    }
  }

  private start() {
    const cmd: StartCommand = {command: 'START'};
    this.addCommand(cmd);
  }

  private stop() {
    const cmd: StopCommand = {command: 'STOP'};
    this.addCommand(cmd);
  }

  goTo(to: Coordinates) {
    const cmd: GoToCommand = {command: 'GOTO', x: to.x, y: to.y};
    this.addCommand(cmd);
    this.cutterPosition = to;
  }

  private up() {
    const cmd: UpCommand = {command: 'UP'};
    this.addCommand(cmd);
  }

  private down() {
    const cmd: DownCommand = {command: 'DOWN'};
    this.addCommand(cmd);
  }

  private addCommand(cmd: Command) {
    this.commands.push(cmd);
  }

  private coordinatesMatch(c1: Coordinates, c2: Coordinates) {
    return c1.x === c2.x && c1.y === c2.y;
  }
}
