import { BoxSize, Direction, FigureInterface, FigurePositionInterface, SheetSize } from './models';
import { CrossFigure } from './cross-figure';
import { Field } from './field';


export class FieldFigureDistributor {
  fillBoxes(boxSize: BoxSize, sheetSize: SheetSize): FigurePositionInterface[] {
    boxSize = this.adjustBoxSizes(boxSize);

    let bestFigurePositions: FigurePositionInterface[] = [];

    for (const figures of this.createFigureSets(boxSize, sheetSize)) {
      const figurePositions: FigurePositionInterface[] = [];
      let field = Field.createEmpty(sheetSize.width, sheetSize.length);

      while (true) {
        const bestPosition = field.bestFigureMatch(figures);
        if (bestPosition === null) {
          break;
        } else {
          figurePositions.push(bestPosition);
        }

        field = field.applyFigurePosition(bestPosition);
      }

      if (figurePositions.length > bestFigurePositions.length) {
        bestFigurePositions = figurePositions;
      }
    }

    return bestFigurePositions;
  }

  /**
   * Creates 2 figures sets with vertical order
   */
  private createFigureSets(boxSize: BoxSize, sheetSize: SheetSize): FigureInterface[][] {
    const horizontalPrioritySet = [
      new CrossFigure(Direction.Left, boxSize),
      new CrossFigure(Direction.Down, boxSize),
      new CrossFigure(Direction.Right, boxSize),
      new CrossFigure(Direction.Up, boxSize),
    ];

    const verticalPrioritySet = [
      new CrossFigure(Direction.Down, boxSize),
      new CrossFigure(Direction.Left, boxSize),
      new CrossFigure(Direction.Up, boxSize),
      new CrossFigure(Direction.Right, boxSize),
    ];

    return [horizontalPrioritySet, verticalPrioritySet];
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
