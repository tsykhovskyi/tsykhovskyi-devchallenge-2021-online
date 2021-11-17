import { BoxSize, Direction, FigureInterface, FigurePositionInterface, SheetSize } from './models';
import { CrossFigure } from './cross-figure';
import { Field } from './field';


export class FieldFigureDistributor {
  fillBoxes(boxSize: BoxSize, sheetSize: SheetSize): FigurePositionInterface[] {
    boxSize = this.adjustBoxSizes(boxSize);

    const result: FigurePositionInterface[] = [];
    const figures = this.createFigures(boxSize);

    let field = Field.createEmpty(sheetSize.width, sheetSize.length);

    while (true) {
      const bestPosition = field.bestFigureMatch(figures);

      if (bestPosition === null) {
        break;
      } else {
        result.push(bestPosition);
      }

      field = field.applyFigurePosition(bestPosition);
    }

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

  /**
   * Change box schema width, height, depth values according to optimization rule:
   * height <= width <= depth
   */
  private adjustBoxSizes(boxSize: BoxSize): BoxSize {
    const sizes = Object.values(boxSize);
    sizes.sort((a, b) => a - b);

    return {
      height: sizes[0],
      width: sizes[1],
      depth: sizes[2],
    }
  }
}
