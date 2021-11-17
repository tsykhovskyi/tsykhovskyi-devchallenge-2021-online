import { FigurePositionInterface } from '../box/models';
import { Command } from './models';
import { Plotter } from './plotter';

export class Renderer {
  private plotter: Plotter;

  constructor() {
    this.plotter = new Plotter();
  }


  render(figurePositions: FigurePositionInterface[]): Command[] {
    for (const figurePosition of figurePositions) {
      for (const line of figurePosition.circuit()) {
        this.plotter.line(line.from, line.to);
      }
    }

    return this.plotter.finish();
  }
}
