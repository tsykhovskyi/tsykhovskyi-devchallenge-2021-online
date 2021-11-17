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
    if (intervals.length === 0) {
      throw new Error('Intervals should not be empty');
    }
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

  get lowestHeight(): number {
    let height = this.intervals[0].height;
    for (const interval of this.intervals) {
      height = Math.min(height, interval.height);
      if (height === 0) {
        return 0;
      }
    }

    return height;
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
      if (this.intervals[replaceStart].height === patchIntervals[0].height) {
        patchIntervals[0] = {...patchIntervals[0], start: this.intervals[replaceStart].start};
      } else {
        patchIntervals.unshift({...this.intervals[replaceStart], end: patchLanding.start});
      }
    }
    if (patchLanding.end !== this.intervals[replaceEnd].end) {
      if (this.intervals[replaceEnd].height === patchIntervals[patchIntervals.length - 1].height) {
        patchIntervals[patchIntervals.length - 1] = {
          ...patchIntervals[patchIntervals.length - 1],
          end: this.intervals[replaceEnd].end
        };
      } else {
        patchIntervals.push({...this.intervals[replaceEnd], start: patchLanding.end});
      }
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

    const lowestHeight = this.lowestHeight;

    const lowestInterval = this.intervals.find(interval => interval.height === lowestHeight);
    if (lowestInterval === undefined) {
      throw new Error('Runtime error');
    }

    const blockRelatedLandings = figure.bottomShapeLandingOptions()
    for (let blockRelatedLanding of blockRelatedLandings) {
      for (const blockLanding of [
        blockRelatedLanding.shift(lowestInterval.start, 0),
        blockRelatedLanding.shift(lowestInterval.end, 0),
      ]) {
        // Do not duplicate same position
        if (uniqueBlockPositions.has(blockLanding.start)) {
          continue;
        }
        // Validate constraints
        if (blockLanding.start < this.start || blockLanding.end > this.end) {
          continue;
        }
        const height = this.fitHeight(blockLanding);
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
