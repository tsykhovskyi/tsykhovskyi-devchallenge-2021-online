import { Line, Point } from "./models";

export class Circuit {
  private lines: Line[] = [];
  private currentPoint: Point;

  constructor(private startPoint: Point) {
    this.currentPoint = startPoint;
  }

  up(length: number): Circuit {
    this.goTo({ x: this.currentPoint.x, y: this.currentPoint.y + length });
    return this;
  }

  down(length: number): Circuit {
    this.goTo({ x: this.currentPoint.x, y: this.currentPoint.y - length });
    return this;
  }

  left(length: number): Circuit {
    this.goTo({ x: this.currentPoint.x - length, y: this.currentPoint.y });
    return this;
  }

  right(length: number): Circuit {
    this.goTo({ x: this.currentPoint.x + length, y: this.currentPoint.y });
    return this;
  }

  validate() {
    if (
      this.currentPoint.x !== this.startPoint.x ||
      this.currentPoint.y !== this.startPoint.y
    ) {
      throw new Error("Invalid circuit");
    }

    return this;
  }

  circuitLines(): Line[] {
    return this.lines;
  }

  private goTo(point: Point) {
    this.lines.push({ from: this.currentPoint, to: point });
    this.currentPoint = point;
  }
}
