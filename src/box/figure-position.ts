import {
  FigureInterface,
  Point,
  FigurePositionInterface,
  LandingInterface,
  Line,
} from "./models";

export class FigurePosition implements FigurePositionInterface {
  constructor(
    public readonly figure: FigureInterface,
    public readonly offsetPoint: Point
  ) {}

  get top() {
    return this.figure.height + this.offsetPoint.y;
  }

  topShapeLanding(): LandingInterface {
    const relativeLanding = this.figure.topShapeLanding();

    return relativeLanding.shift(this.offsetPoint.x, this.offsetPoint.y);
  }

  switchProjection(): FigurePositionInterface {
    const offsetPoint = { x: this.offsetPoint.y, y: this.offsetPoint.x };
    const figure = this.figure.switchProjection();

    return new FigurePosition(figure, offsetPoint);
  }

  circuit(): Line[] {
    return this.figure.circuit(this.offsetPoint);
  }
}
