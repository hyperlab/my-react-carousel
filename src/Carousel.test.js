import React from "react";
import Carousel from "./Carousel";
import { render, cleanup, act } from "react-testing-library";

afterEach(cleanup);

describe("Carousel", () => {
  describe("default behaviour", () => {
    it("renders children inside the containers", () => {
      const Slide = jest.fn(({ id }) => <div>{id}</div>);
      render(
        <Carousel infinite={false}>
          <Slide id="1" />
          <Slide id="2" />
          <Slide id="3" />
          <Slide id="4" />
          <Slide id="5" />
        </Carousel>
      );

      expect(Slide).toHaveBeenCalledTimes(5);
    });

    it("renders the children several times if infinite mode is on", () => {
      const Slide = jest.fn(({ id }) => <div>{id}</div>);
      render(
        <Carousel>
          <Slide id="1" />
          <Slide id="2" />
          <Slide id="3" />
          <Slide id="4" />
          <Slide id="5" />
          <Slide id="6" />
          <Slide id="7" />
          <Slide id="8" />
          <Slide id="9" />
          <Slide id="10" />
        </Carousel>
      );

      // 5 slides rendered before, 10 main slides, 5 slides rendered after to make infinite scrolling possible
      expect(Slide).toHaveBeenCalledTimes(5 + 10 + 5);
    });

    it("renders less children with less slidesToShow", () => {
      const Slide = jest.fn(({ id }) => <div>{id}</div>);
      render(
        <Carousel slidesToShow={1}>
          <Slide id="1" />
          <Slide id="2" />
          <Slide id="3" />
          <Slide id="4" />
          <Slide id="5" />
          <Slide id="6" />
          <Slide id="7" />
          <Slide id="8" />
          <Slide id="9" />
          <Slide id="10" />
        </Carousel>
      );

      expect(Slide).toHaveBeenCalledTimes(3 + 10 + 3);
    });

    it("changes currentSlide when next/previous is used", () => {
      const Slide = jest.fn(({ id }) => <div>{id}</div>);

      let triggerPrevious, triggerNext;
      let current;

      render(
        <Carousel
          render={({ slides, previous, next, currentStep }) => {
            triggerPrevious = previous;
            triggerNext = next;
            current = currentStep;
            return slides;
          }}
        >
          <Slide id="1" />
          <Slide id="2" />
          <Slide id="3" />
          <Slide id="4" />
          <Slide id="5" />
          <Slide id="6" />
          <Slide id="7" />
          <Slide id="8" />
          <Slide id="9" />
          <Slide id="10" />
        </Carousel>
      );

      expect(current).toBe(0);
      act(triggerPrevious);
      expect(current).toBe(9);
      act(triggerNext);
      expect(current).toBe(0);
    });

    it("doesn't change slide if you're trying to move past the limits", () => {
      let triggerPrevious, triggerNext, canTriggerPrevious, canTriggerNext;
      let current;

      render(
        <Carousel
          infinite={false}
          render={({
            slides,
            previous,
            next,
            hasPrevious,
            hasNext,
            currentStep
          }) => {
            triggerPrevious = previous;
            triggerNext = next;
            canTriggerPrevious = hasPrevious;
            canTriggerNext = hasNext;
            current = currentStep;
            return slides;
          }}
        >
          <div />
          <div />
          <div />
          <div />
          <div />
        </Carousel>
      );

      expect(current).toBe(0);
      expect(canTriggerPrevious).toBe(false);
      act(triggerPrevious);
      expect(current).toBe(0);
      act(triggerNext);
      expect(current).toBe(1);
      expect(canTriggerNext).toBe(true);
      expect(canTriggerPrevious).toBe(true);
      act(triggerNext);
      expect(current).toBe(2);
      expect(canTriggerNext).toBe(false);
      expect(canTriggerPrevious).toBe(true);
      act(triggerNext);
      expect(current).toBe(2);
    });

    it("provides the options passed as props to the render function", () => {
      const infinite = false;
      const slidesToShow = 2;
      const centerCurrentSlide = true;
      const transitionDuration = 150;

      const renderer = jest.fn(() => null);

      render(
        <Carousel
          infinite={infinite}
          slidesToShow={slidesToShow}
          centerCurrentSlide={centerCurrentSlide}
          transitionDuration={transitionDuration}
          render={renderer}
        />
      );

      expect(renderer).toHaveBeenCalledTimes(1);
      expect(renderer).toHaveBeenCalledWith(
        expect.objectContaining({
          infinite,
          slidesToShow,
          centerCurrentSlide,
          transitionDuration
        })
      );
    });
  });
});
