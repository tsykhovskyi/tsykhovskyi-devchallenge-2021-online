import { Landing } from "./landing";

describe("Landing", () => {
  describe("Initial properties", function () {
    const landing = new Landing([
      { start: 100, end: 150, height: 20 },
      { start: 150, end: 200, height: 50 },
      { start: 200, end: 250, height: 10 },
      { start: 250, end: 300, height: 5 },
    ]);

    it("should have valid properties", function () {
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

    it("should create valid slice", function () {
      const slice = landing.slice(50, 150);

      expect(slice.intervals).toEqual([
        { start: 50, end: 100, height: 10 },
        { start: 100, end: 150, height: 20 },
      ]);
    });

    it("should overwrite intervals", function () {
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
  });
});
