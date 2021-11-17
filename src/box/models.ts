export interface SheetSize {
  width: number;
  length: number;
}

export interface BoxSize {
  height: number;
  width: number;
  depth: number;
}

export enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  from: Point;
  to: Point;
}

export type Axis = "x" | "y";

export interface FigureInterface {
  readonly direction: Direction;
  readonly size: BoxSize;
  readonly width: number;
  readonly height: number;

  bottomShapeLandingOptions(): LandingInterface[];
  topShapeLanding(): LandingInterface;
  switchProjection(): FigureInterface;
  circuit(position: Point): Line[];
}

export interface FigurePositionInterface {
  readonly figure: FigureInterface;
  readonly offsetPoint: Point;

  readonly top: number;
  topShapeLanding(): LandingInterface;
  switchProjection(): FigurePositionInterface;
  circuit(): Line[];
}

export interface LandingInterface {
  intervals: ReadonlyArray<LandingInterval>;
  start: number;
  end: number;
  lowestHeight: number;
  square: number;

  /**
   * Calculates square under provided interval
   */
  intervalSquare(start: number, end: number): number;

  /**
   * Extract landing for defined start and end.
   */
  slice(start: number, end: number): LandingInterface;

  /**
   * Update existed landing with patchLanding values only higher value.
   *
   * (5, 1, 3, 1) + (-, 2, 2, 2) = (5, 2, 3, 2)
   */
  apply(patchLanding: LandingInterface): LandingInterface;

  /**
   * Find minimum landing-related height which can fit block path without intersection
   */
  fitHeight(block: LandingInterface): number;

  /**
   * Return new landing with moved position and height
   */
  shift(positionShift: number, heightShift: number): LandingInterface;

  potentialLandingPositions(box: FigureInterface): FigurePositionInterface[];
}

export interface FieldInterface {
  bestFigureMatch(figures: FigureInterface[]): FigurePositionInterface | null;
  applyFigurePosition(figurePosition: FigurePositionInterface): FieldInterface;
}

export interface LandingInterval {
  readonly start: number;
  readonly end: number;
  readonly height: number;
}
