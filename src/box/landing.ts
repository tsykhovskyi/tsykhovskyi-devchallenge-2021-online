import {
  Axis,
  FigureInterface,
  LandingInterface,
  LandingInterval, Point,
  FigurePositionInterface
} from './models';
import { FigurePosition } from './figure-position';

export class Landing implements LandingInterface {
  constructor(public intervals: ReadonlyArray<LandingInterval>) {
  }

  static create(width: number) {
    const intervals = [{start: 0, end: width, height: 0}];
    return new Landing(intervals);
  }

  get start(): number {
    return this.intervals[0].start;
  }

  get end(): number {
    return this.intervals[this.intervals.length - 1].end;
  }

  get square(): number {
    return this.intervals.reduce((square, interval) => square + (interval.end - interval.start) * interval.height, 0);
  }

  intervalSquare(start: number, end: number): number {
    let square = 0;
    for (const interval of this.intervals) {
      if (start >= interval.end) {
        continue;
      }

      if (end <= interval.start) {
        break;
      }

      square += (Math.min(interval.end, end) - Math.max(start, interval.start)) * interval.height;
    }

    return square;
  }

  overwrite(patchLanding: LandingInterface): LandingInterface {
    let replaceStart = null;
    let replaceEnd = null;

    // Find start and end intervals source intervals that will be replaces.
    for (let i = 0; i < this.intervals.length; i++) {
      const interval = this.intervals[i];
      if (interval.start <= patchLanding.start && interval.end > patchLanding.start) {
        replaceStart = i;
      }
      if (interval.start < patchLanding.end && interval.end >= patchLanding.end) {
        replaceEnd = i;
        break;
      }
    }

    if (replaceStart === null || replaceEnd === null) {
      throw new Error('Invalid interval calculation');
    }

    const patchIntervals = [...patchLanding.intervals];
    // Create new intervals slice
    if (patchLanding.start !== this.intervals[replaceStart].start) {
      patchIntervals.unshift({...this.intervals[replaceStart], end: patchLanding.start});
    }
    if (patchLanding.end !== this.intervals[replaceEnd].end) {
      patchIntervals.push({...this.intervals[replaceEnd], start: patchLanding.end});
    }

    const newIntervals = [...this.intervals]
    newIntervals.splice(replaceStart, replaceEnd - replaceStart + 1, ...patchIntervals);

    return new Landing(newIntervals);
  }

  slice(start: number, end: number): LandingInterface {
    const result: LandingInterval[] = [];
    for (const interval of this.intervals) {
      if (start >= interval.end) {
        continue;
      }

      if (end <= interval.start) {
        break;
      }

      result.push({
        start: Math.max(start, interval.start),
        end: Math.min(interval.end, end),
        height: interval.height
      })
    }

    return new Landing(result);
  }

  shift(positionShift: number, heightShift: number): LandingInterface {
    return new Landing(this.intervals.map(interval => ({
      start: interval.start + positionShift,
      end: interval.end + positionShift,
      height: interval.height + heightShift
    })));
  }

  /**
   * O(N)
   */
  fitHeight(block: LandingInterface): number {
    let height = 0;
    let i = 0;

    for (const bInterval of block.intervals) {
      // While current interval is not ahead of block interval
      while (i < this.intervals.length && this.intervals[i].start < bInterval.end) {
        if (this.intervals[i].end > bInterval.start) {
          // Adjust result height
          height = Math.max(height, this.intervals[i].height - bInterval.height);
        }
        i++;
      }
      i--;
    }

    return height;
  }

  potentialLandingPositions(figure: FigureInterface): FigurePositionInterface[] {
    const resultPoints: Point[] = [];
    const uniqueBlockPositions = new Set<number>();

    for (const interval of this.intervals) {
      const blockLandings = figure.bottomShapeLandingOptions()
      for (let blockLanding of blockLandings) {
        if (uniqueBlockPositions.has(blockLanding.start)) {
          continue;
        }

        // Move landing to interval start
        blockLanding = blockLanding.shift(interval.start, 0);
        // Validate constraints
        if (blockLanding.start < this.start || blockLanding.end > this.end) {
          continue;
        }
        const height = this.fitHeight(blockLanding);
        // Move landing to its defined position

        resultPoints.push({x: blockLanding.start, y: height});
        uniqueBlockPositions.add(blockLanding.start);
      }
    }

    const figurePositions = [];
    for (const position of resultPoints) {
      figurePositions.push(new FigurePosition(figure, position));
    }

    return figurePositions;
  }
}
