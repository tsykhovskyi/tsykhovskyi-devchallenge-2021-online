import {
  BoxSize,
  Direction,
  FigureInterface,
  LandingInterface,
  Line,
  Point,
} from "./models";
import { Landing } from "./landing";
import { Circuit } from "./circuit";

export class CrossFigure implements FigureInterface {
  public readonly width: number;
  public readonly height: number;

  constructor(
    public readonly direction: Direction,
    public readonly size: BoxSize
  ) {
    this.width = 2 * (size.height + size.width);
    this.height = 2 * size.height + size.depth;

    if (direction === Direction.Up || direction === Direction.Down) {
      [this.width, this.height] = [this.height, this.width];
    }
  }

  /**
   * Create all blockLandings that will be fit on landing
   */
  bottomShapeLandingOptions(): LandingInterface[] {
    let p1 = null;
    let p2 = null;
    let p3 = null;
    let depth = null;

    if (this.direction === Direction.Left) {
      p1 = this.size.height;
      p2 = p1 + this.size.width;
      p3 = p2 + this.size.height + this.size.width;
      depth = this.size.height;
    }

    if (this.direction === Direction.Down) {
      p1 = this.size.height;
      p2 = p1 + this.size.depth;
      p3 = p2 + this.size.height;
      depth = this.size.height;
    }

    if (this.direction === Direction.Right) {
      p1 = this.size.height + this.size.width;
      p2 = p1 + this.size.width;
      p3 = p2 + this.size.height;
      depth = this.size.height;
    }

    if (this.direction === Direction.Up) {
      p1 = this.size.height;
      p2 = p1 + this.size.depth;
      p3 = p2 + this.size.height;
      depth = this.size.height + this.size.width;
    }

    if (p1 === null || p2 === null || p3 === null || depth === null) {
      throw new Error("Runtime error");
    }

    return [
      this.createBlockLanding(0, p1, p2, p3, depth),
      this.createBlockLanding(-p1, 0, p2 - p1, p3 - p1, depth),
      this.createBlockLanding(-p2, p1 - p2, 0, p3 - p2, depth),
      this.createBlockLanding(-p3, p1 - p3, p2 - p3, 0, depth),
    ];
  }

  topShapeLanding(): LandingInterface {
    let p1 = null;
    let p2 = null;
    let p3 = null;
    let level = null;

    if (this.direction === Direction.Left) {
      p1 = this.size.height;
      p2 = p1 + this.size.width;
      p3 = p2 + this.size.height + this.size.width;
      level = this.size.height + this.size.depth;

      return new Landing([
        { start: 0, end: p1, height: level },
        { start: p1, end: p2, height: level + this.size.height },
        { start: p2, end: p3, height: level },
      ]);
    }

    if (this.direction === Direction.Down) {
      p1 = this.size.height;
      p2 = p1 + this.size.depth;
      p3 = p2 + this.size.height;
      level = this.size.height + this.size.width;

      return new Landing([
        { start: 0, end: p1, height: level },
        {
          start: p1,
          end: p2,
          height: level + this.size.height + this.size.width,
        },
        { start: p2, end: p3, height: level },
      ]);
    }

    if (this.direction === Direction.Right) {
      p1 = this.size.height + this.size.width;
      p2 = p1 + this.size.width;
      p3 = p2 + this.size.height;
      level = this.size.height + this.size.depth;

      return new Landing([
        { start: 0, end: p1, height: level },
        { start: p1, end: p2, height: level + this.size.height },
        { start: p2, end: p3, height: level },
      ]);
    }

    if (this.direction === Direction.Up) {
      p1 = this.size.height;
      p2 = p1 + this.size.depth;
      p3 = p2 + this.size.height;
      level = this.size.height + 2 * this.size.width;

      return new Landing([
        { start: 0, end: p1, height: level },
        { start: p1, end: p2, height: level + this.size.height },
        { start: p2, end: p3, height: level },
      ]);
    }

    throw new Error("Runtime error");
  }

  switchProjection(): FigureInterface {
    switch (this.direction) {
      case Direction.Left:
        return new CrossFigure(Direction.Down, this.size);
      case Direction.Down:
        return new CrossFigure(Direction.Left, this.size);
      case Direction.Right:
        return new CrossFigure(Direction.Up, this.size);
      case Direction.Up:
        return new CrossFigure(Direction.Right, this.size);
    }

    throw new Error("Runtime error");
  }

  circuit(position: Point = { x: 0, y: 0 }): Line[] {
    const { height, width, depth } = this.size;

    if (this.direction === Direction.Left) {
      const circuit = new Circuit({ x: position.x, y: position.y + height });
      return circuit
        .up(depth)
        .right(height)
        .up(height)
        .right(width)
        .down(height)
        .right(height + width)
        .down(depth)
        .left(width + height)
        .down(height)
        .left(width)
        .up(height)
        .left(height)
        .validate()
        .circuitLines();
    }

    if (this.direction === Direction.Down) {
      const circuit = new Circuit({ x: position.x, y: position.y + height });
      return circuit
        .up(width)
        .right(height)
        .up(height + width)
        .right(depth)
        .down(width + height)
        .right(height)
        .down(width)
        .left(height)
        .down(height)
        .left(depth)
        .up(height)
        .left(height)
        .validate()
        .circuitLines();
    }

    if (this.direction === Direction.Right) {
      const circuit = new Circuit({ x: position.x, y: position.y + height });
      return circuit
        .up(depth)
        .right(width + height)
        .up(height)
        .right(width)
        .down(height)
        .right(height)
        .down(depth)
        .left(height)
        .down(height)
        .left(width)
        .up(height)
        .left(height + width)
        .validate()
        .circuitLines();
    }

    if (this.direction === Direction.Up) {
      const circuit = new Circuit({
        x: position.x,
        y: position.y + width + height,
      });
      return circuit
        .up(width)
        .right(height)
        .up(height)
        .right(depth)
        .down(height)
        .right(height)
        .down(width)
        .left(height)
        .down(height + width)
        .left(depth)
        .up(width + height)
        .left(height)
        .validate()
        .circuitLines();
    }

    throw new Error("Runtime error");
  }

  private createBlockLanding(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    depth: number
  ): LandingInterface {
    return new Landing([
      { start: p0, end: p1, height: depth },
      { start: p1, end: p2, height: 0 },
      { start: p2, end: p3, height: depth },
    ]);
  }
}
