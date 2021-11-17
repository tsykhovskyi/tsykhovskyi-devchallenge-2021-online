import { Plotter } from "./plotter";
import { Command } from "./models";

describe("Plotter", () => {
  it("should create render commands", () => {
    const plotter = new Plotter();

    const commands = plotter
      .line({ x: 100, y: 200 }, { x: 300, y: 300 })
      .line({ x: 300, y: 300 }, { x: 300, y: 0 })
      .line({ x: 999, y: 999 }, { x: 1000, y: 1000 })
      .finish();

    const expectedCommands: Command[] = [
      { command: "START" },
      { command: "GOTO", x: 100, y: 200 },
      { command: "DOWN" },
      { command: "GOTO", x: 300, y: 300 }, // first line
      { command: "GOTO", x: 300, y: 0 }, // second line
      { command: "UP" },
      { command: "GOTO", x: 999, y: 999 },
      { command: "DOWN" },
      { command: "GOTO", x: 1000, y: 1000 }, // third line
      { command: "STOP" },
    ];

    expect(commands).toEqual(expectedCommands);
  });
});
