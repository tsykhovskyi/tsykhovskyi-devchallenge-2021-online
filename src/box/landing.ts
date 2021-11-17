import {
  FigureInterface,
  LandingInterface,
  LandingInterval,
  Point,
  FigurePositionInterface,
} from "./models";
import { FigurePosition } from "./figure-position";

export class Landing implements LandingInterface {
  constructor(public intervals: ReadonlyArray<LandingInterval>) {
    if (intervals.length === 0) {
      throw new Error("Intervals should not be empty");
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
    return this.intervals.reduce(
      (square, interval) =>
        square + (interval.end - interval.start) * interval.height,
      0
    );
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

      square +=
        (Math.min(interval.end, end) - Math.max(start, interval.start)) *
        interval.height;
    }

    return square;
  }

  apply(patch: LandingInterface): LandingInterface {
    let i = this.intervals.findIndex(interval => interval.end > patch.start);
    if (i === -1) {
      return new Landing([...this.intervals]);
    }

    let newIntervals = this.intervals.slice(0, i);
    let position = this.intervals[i].start;
    let patchI = 0;

    let bufferIntervals: LandingInterval[] = [];
    if (patch.intervals[patchI].start > this.intervals[i].start) {
      bufferIntervals.push({
        start: this.intervals[i].start,
        end: patch.intervals[patchI].start,
        height: this.intervals[i].height
      });
      position = patch.intervals[patchI].start;
    }

    while (true) {
      // If iterators behind position, increase them
      if (position >= this.intervals[i].end) {
        i++;
      }
      if (position >= patch.intervals[patchI].end) {
        patchI++;
      }
      if (i === this.intervals.length || patchI === patch.intervals.length) {
        break;
      }

      // Find closest intervals start/end point
      const nextPosition = [
        this.intervals[i].start,
        this.intervals[i].end,
        patch.intervals[patchI].start,
        patch.intervals[patchI].end,
      ].filter(p => p > position).sort((a, b) => a - b).shift();
      if (nextPosition === undefined) {
        throw new Error('Logic error');
      }

      if (nextPosition > this.end) {
        break;
      }

      const height = Math.max(this.intervals[i].height, patch.intervals[patchI].height);
      if (bufferIntervals.length !== 0 && bufferIntervals[bufferIntervals.length - 1].height === height) {
        bufferIntervals[bufferIntervals.length - 1] = {
          ...bufferIntervals[bufferIntervals.length - 1],
          end: nextPosition
        };
      } else {
        bufferIntervals.push({start: position, end: nextPosition, height});
      }
      position = nextPosition;
    }

    newIntervals.push(...bufferIntervals);

    if (i < this.intervals.length && this.intervals[i].end > position) {
      if (newIntervals.length !== 0 && newIntervals[newIntervals.length - 1].height === this.intervals[i].height) {
        newIntervals[newIntervals.length - 1] = {
          ...newIntervals[newIntervals.length - 1],
          end: this.intervals[i].end
        };
      } else {
        newIntervals.push({start: position, end: this.intervals[i].end, height: this.intervals[i].height});
      }

      newIntervals.push(...this.intervals.slice(++i));
    }

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
        height: interval.height,
      });
    }

    return new Landing(result);
  }

  shift(positionShift: number, heightShift: number): LandingInterface {
    return new Landing(
      this.intervals.map((interval) => ({
        start: interval.start + positionShift,
        end: interval.end + positionShift,
        height: interval.height + heightShift,
      }))
    );
  }

  /**
   * O(N)
   */
  fitHeight(block: LandingInterface): number {
    let height = 0;
    let i = 0;

    for (const bInterval of block.intervals) {
      // While current interval is not ahead of block interval
      while (
        i < this.intervals.length &&
        this.intervals[i].start < bInterval.end
        ) {
        if (this.intervals[i].end > bInterval.start) {
          // Adjust result height
          height = Math.max(
            height,
            this.intervals[i].height - bInterval.height
          );
        }
        i++;
      }
      i--;
    }

    return height;
  }

  potentialLandingPositions(
    figure: FigureInterface
  ): FigurePositionInterface[] {
    const resultPoints: Point[] = [];
    const uniqueBlockPositions = new Set<number>();

    const lowestHeight = this.lowestHeight;

    const lowestInterval = this.intervals.find(
      (interval) => interval.height === lowestHeight
    );
    if (lowestInterval === undefined) {
      throw new Error("Runtime error");
    }

    const blockRelatedLandings = figure.bottomShapeLandingOptions();
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
