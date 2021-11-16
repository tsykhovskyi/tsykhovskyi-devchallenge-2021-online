import { FieldInterface, FigureInterface, FigurePositionInterface, LandingInterface } from './models';
import { Landing } from './landing';

interface PositionScore {
  position: FigurePositionInterface,
  square: number
}

export class Field implements FieldInterface {

  constructor(private xLanding: LandingInterface, private yLanding: LandingInterface) {
  }

  static createEmpty(width: number, length: number): FieldInterface {
    const xLanding = Landing.create(width);
    const yLanding = Landing.create(length);

    return new Field(xLanding, yLanding);
  }

  bestFigureMatch(figures: FigureInterface[]): FigurePositionInterface | null {
    const positionsScores: PositionScore[] = [];

    for (const figure of figures) {
      const xPositions = this.xLanding.potentialLandingPositions(figure);
      for (const xPosition of xPositions) {
        if (xPosition.top > this.yLanding.end) {
          continue;
        }

        positionsScores.push({
          position: xPosition,
          square: this.xPositionFieldSquare(xPosition)
        })
      }

      const yPositions = this.yLanding.potentialLandingPositions(figure);
      for (const yPosition of yPositions) {
        if (yPosition.top > this.xLanding.end) {
          continue;
        }

        const xPosition = yPosition.switchProjection();

        positionsScores.push({
          position: xPosition,
          square: this.xPositionFieldSquare(xPosition)
        })
      }
    }

    positionsScores.sort(({square: s1}, {square: s2}) => s1 - s2);

    const figurePositionScore = positionsScores.shift()

    return figurePositionScore !== undefined ? figurePositionScore.position : null;
  }

  applyFigurePosition(figurePosition: FigurePositionInterface): FieldInterface {
    const xLanding = this.xLanding.overwrite(figurePosition.topShapeLanding());
    const yLanding = this.yLanding.overwrite(figurePosition.switchProjection().topShapeLanding());

    return new Field(xLanding, yLanding);
  }

  private xPositionFieldSquare(position: FigurePositionInterface): number {
    const xSquare = this.xLanding.overwrite(position.topShapeLanding()).square;
    const ySquare = this.yLanding.overwrite(position.switchProjection().topShapeLanding()).square;

    return xSquare + ySquare;
  }
}
