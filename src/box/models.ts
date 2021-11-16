import { CrossFigure } from './cross-figure';

export interface SheetSize {
  width: number;
  length: number
}

export interface BoxSize {
  height: number;
  width: number;
  depth: number;
}

export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface Point {
  x: number;
  y: number;
}

export type Axis = 'x' | 'y';

export interface FigureInterface {
  readonly direction: Direction;
  readonly size: BoxSize;
  readonly width: number;
  readonly height: number;

  bottomShapeLandingOptions(): LandingInterface[];
  topShapeLanding(): LandingInterface;
  switchProjection(): FigureInterface;
}

export interface FigurePositionInterface {
  readonly figure: FigureInterface;
  readonly offsetPoint: Point;

  readonly top: number;
  topShapeLanding(): LandingInterface;
  switchProjection(): FigurePositionInterface;
}

export interface LandingInterface {
  intervals: ReadonlyArray<LandingInterval>;
  start: number;
  end: number;
  square: number;

  /**
   * Extract landing for defined start and end.
   */
  slice(start: number, end: number): LandingInterface;

  /**
   * Overwrite existed landing with patchLanding on matched intervals
   */
  overwrite(patchLanding: LandingInterface): LandingInterface;

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
  bestFigureMatch(figures: FigureInterface[]): FigurePositionInterface | null
  applyFigurePosition(figurePosition: FigurePositionInterface): FieldInterface;
}

export interface LandingInterval {
  readonly start: number;
  readonly end: number;
  readonly height: number;
}