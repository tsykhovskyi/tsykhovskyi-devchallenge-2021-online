import { Landing } from "./landing";
import { FigureInterface } from "./models";

describe("Landing", () => {
  describe("Initial properties", () => {
    const landing = new Landing([
      { start: 100, end: 150, height: 20 },
      { start: 150, end: 200, height: 50 },
      { start: 200, end: 250, height: 10 },
      { start: 250, end: 300, height: 5 },
    ]);

    it("should have valid properties", () => {
      expect(landing.start).toEqual(100);
      expect(landing.end).toEqual(300);
      expect(landing.lowestHeight).toEqual(5);
      expect(landing.square).toEqual(4250);
    });
  });

  describe("intervals manipulation", () => {
    const landing = new Landing([
      { start: 0, end: 100, height: 10 },
      { start: 100, end: 200, height: 20 },
      { start: 200, end: 300, height: 30 },
      { start: 300, end: 400, height: 40 },
    ]);

    it("should create valid slice", () => {
      const slice = landing.slice(50, 150);

      expect(slice.intervals).toEqual([
        { start: 50, end: 100, height: 10 },
        { start: 100, end: 150, height: 20 },
      ]);
    });

    it("should overwrite intervals", () => {
      const patchLanding = new Landing([
        { start: 50, end: 150, height: 100 },
        { start: 150, end: 200, height: 0 },
        { start: 200, end: 250, height: 30 }, // same height
      ]);

      const result = landing.overwrite(patchLanding);

      expect(result.intervals).toEqual([
        { start: 0, end: 50, height: 10 },
        { start: 50, end: 150, height: 100 },
        { start: 150, end: 200, height: 0 },
        { start: 200, end: 300, height: 30 },
        { start: 300, end: 400, height: 40 },
      ]);
    });

    it("should calculate interval square", () => {
      expect(landing.intervalSquare(0, 100)).toEqual(1000);
      expect(landing.intervalSquare(0, 150)).toEqual(2000);
      expect(landing.intervalSquare(350, 999)).toEqual(2000);

      expect(landing.intervalSquare(200, 200)).toEqual(0);
      expect(landing.intervalSquare(201, 201)).toEqual(0);
      expect(landing.intervalSquare(150, 99)).toEqual(0);
    });

    it("should shift landing", () => {
      expect(landing.shift(100, 1).intervals).toEqual([
        { start: 100, end: 200, height: 11 },
        { start: 200, end: 300, height: 21 },
        { start: 300, end: 400, height: 31 },
        { start: 400, end: 500, height: 41 },
      ]);
    });
  });

  describe("Figures fit", () => {
    /**
     *   +++
     *    +
     * ==       =
     * ==    ====
     * ==== =====
     * ==========
     */
    const landing = new Landing([
      { start: 0, end: 2, height: 4 },
      { start: 2, end: 4, height: 2 },
      { start: 4, end: 5, height: 1 },
      { start: 5, end: 6, height: 2 },
      { start: 6, end: 9, height: 3 },
      { start: 9, end: 10, height: 4 },
    ]);
    // T-block factory for position
    const block = (start: number) =>
      new Landing([
        { start: start, end: start + 1, height: 1 },
        { start: start + 1, end: start + 2, height: 0 },
        { start: start + 2, end: start + 3, height: 1 },
      ]);

    it("should fit figure", () => {
      for (const [position, expectedHeight] of [
        [0, 4],
        [1, 3],
        [2, 2],
        [3, 1],
        [4, 2],
        [5, 3],
        [6, 3],
        [7, 3],
        [8, 4],
      ]) {
        expect(landing.fitHeight(block(position))).toEqual(expectedHeight);
      }
    });
  });
});
