import {
  BoxSize,
  Direction,
  FieldInterface,
  FigureInterface,
  FigurePositionInterface,
  LandingInterface,
  SheetSize
} from './models';
import { Landing } from './landing';
import { CrossFigure } from './cross-figure';
import { Field } from './field';


export class Renderer {
  fillBoxes(boxSize: BoxSize, sheetSize: SheetSize): FigurePositionInterface[] {
    const dt = Date.now();
    let counter = 0;

    const result: FigurePositionInterface[] = [];
    const figures = this.createFigures(boxSize);

    let field = Field.createEmpty(sheetSize.width, sheetSize.length);

    while (true) {
      counter++;

      const bestPosition = field.bestFigureMatch(figures);

      if (bestPosition === null ) {
        break;
      } else {
        result.push(bestPosition);
      }

      field = field.applyFigurePosition(bestPosition);
    }

    console.log('time taken', Date.now() - dt);
    console.log('iteration', counter);

    return result;
  }

  private createFigures(boxSize: BoxSize): FigureInterface[] {
    return [
      new CrossFigure(Direction.Left, boxSize),
      new CrossFigure(Direction.Down, boxSize),
      new CrossFigure(Direction.Right, boxSize),
      new CrossFigure(Direction.Up, boxSize),
    ];
  }
}
