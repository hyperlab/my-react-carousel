import { findClosestPath, generateDots } from "./dots";

describe("findClosestPath", () => {
  it("returns the end index when moving between to close numbers", () => {
    expect(findClosestPath(0, 1, 10)).toBe(1);
    expect(findClosestPath(0, 4, 10)).toBe(4);
    expect(findClosestPath(3, 7, 10)).toBe(7);
    expect(findClosestPath(8, 9, 10)).toBe(9);
    expect(findClosestPath(5, 2, 10)).toBe(2);
    expect(findClosestPath(9, 4, 10)).toBe(4);
  });

  it("moves to the index in the edges if the jump is big", () => {
    expect(findClosestPath(0, 9, 10)).toBe(-1);
    expect(findClosestPath(0, 8, 10)).toBe(-2);
    expect(findClosestPath(0, 7, 10)).toBe(-3);
    expect(findClosestPath(0, 6, 10)).toBe(-4);
    expect(findClosestPath(9, 0, 10)).toBe(10);
    expect(findClosestPath(9, 1, 10)).toBe(11);
    expect(findClosestPath(9, 2, 10)).toBe(12);
    expect(findClosestPath(9, 3, 10)).toBe(13);
  });
});

describe("generateDots", () => {
  it("returns a function", () => {
    expect(typeof generateDots()).toBe("function");
  });

  it("takes a render function which is called with extra props", () => {
    const render = jest.fn();
    const dotsRenderer = generateDots(render);

    dotsRenderer({
      currentStep: 0,
      totalSteps: 2,
      goToStep: () => null
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith({
      currentStep: 0,
      totalSteps: 2,
      goToStep: expect.any(Function),
      dots: [
        {
          index: 0,
          isActive: true,
          onClick: expect.any(Function)
        },
        {
          index: 1,
          isActive: false,
          onClick: expect.any(Function)
        }
      ]
    });
  });

  it("returns dots with an onclick handler that triggers goToStep", () => {
    const goToStep = jest.fn();
    const render = jest.fn(({ dots }) =>
      dots.forEach(({ onClick }) => onClick())
    );
    generateDots(render)({
      currentStep: 0,
      totalSteps: 3,
      goToStep
    });

    expect(render).toHaveBeenCalledTimes(1);
    expect(goToStep).toHaveBeenCalledTimes(3);
    expect(goToStep).toHaveBeenNthCalledWith(1, 0);
    expect(goToStep).toHaveBeenNthCalledWith(2, 1);
    expect(goToStep).toHaveBeenNthCalledWith(3, -1);
  });
});
