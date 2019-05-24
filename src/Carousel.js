import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle
} from "react";
import useTouch from "./useTouch";

const Carousel = (
  {
    children,
    slidesToShow = 3,
    infinite = true,
    transitionDuration = 300,
    centerCurrentSlide = false,
    render = ({ slides }) => slides
  },
  ref
) => {
  const [currentIndex, setIndex] = React.useState(0);

  const { slides, slideCount, preSlidesCount } = useMemo(() => {
    const originalSlides = React.Children.toArray(children);
    const slideCount = originalSlides.length;

    const preSlides = infinite
      ? originalSlides.slice(slideCount - (slidesToShow + 2))
      : [];
    const postSlides = infinite
      ? originalSlides.slice(0, slidesToShow + 2)
      : [];

    const slides = [...preSlides, ...originalSlides, ...postSlides].map(
      (child, index) =>
        React.cloneElement(child, {
          style: {
            flex: `0 0 ${100 / slidesToShow}%`
          },
          key: index
        })
    );

    return {
      slides,
      slideCount,
      preSlidesCount: preSlides.length
    };
  }, [children, infinite, slidesToShow]);

  const previous = useCallback(
    () =>
      setIndex(index => {
        if (infinite || index - 1 >= 0) return index - 1;
        return 0;
      }),
    [infinite]
  );
  const next = useCallback(
    () =>
      setIndex(index => {
        if (infinite || index + 1 < slideCount - slidesToShow) return index + 1;
        return slideCount - slidesToShow;
      }),
    [infinite, slideCount, slidesToShow]
  );

  useImperativeHandle(
    ref,
    () => ({
      previous,
      next
    }),
    [previous, next]
  );

  const inner = React.useRef(null);
  const [itemWidth, setItemWidth] = useState(0);

  const updateItemWidth = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (inner.current) {
          const { width } = inner.current.getBoundingClientRect();
          setItemWidth(Math.round(width / slidesToShow));
        }
      }),
    [slidesToShow]
  );

  useLayoutEffect(() => {
    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, [updateItemWidth]);

  const [disableTransition, setDisableTransition] = useState(false);

  useEffect(() => {
    if (disableTransition) {
      if (currentIndex < 0 || currentIndex >= slideCount) {
        requestAnimationFrame(() =>
          setIndex(index => {
            if (index < 0) {
              if (infinite) return slideCount + index;
              return 0;
            } else {
              return index - slideCount;
            }
          })
        );
      } else {
        requestAnimationFrame(() => setDisableTransition(false));
      }
    } else if (currentIndex >= slideCount || currentIndex < 0) {
      setTimeout(() => setDisableTransition(true), transitionDuration);
    }
  }, [disableTransition, currentIndex, slideCount, transitionDuration]);

  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isTouching,
    touchOffset,
    onClick
  } = useTouch(
    useCallback(
      offset => {
        const slidesMoved = Math.round(offset / itemWidth);
        if (infinite) {
          setIndex(index => index - slides);
        } else {
          setIndex(prevIndex => {
            if (
              prevIndex - slidesMoved >
              slideCount - slidesToShow
            )
              return slideCount - slidesToShow;
            if (prevIndex - slidesMoved < 0) {
              return 0;
            }
            return prevIndex - slidesMoved;
          });
        }
      },
      [itemWidth]
    )
  );

  const centeringOffset = centerCurrentSlide
    ? (slidesToShow / 2 - 0.5) * itemWidth
    : 0;
  const offset =
    touchOffset - (currentIndex + preSlidesCount) * itemWidth + centeringOffset;
  const transition = disableTransition || isTouching ? 0 : transitionDuration;

  const currentStep =
    currentIndex >= slideCount
      ? currentIndex - slideCount
      : currentIndex < 0
      ? currentIndex + slideCount
      : currentIndex;
  const totalSteps = infinite ? slideCount : slideCount - slidesToShow + 1;

  return render({
    next,
    previous,
    totalSteps,
    currentStep,
    goToStep: setIndex,
    slides: (
      <div style={{ width: "100%", overflow: "hidden" }}>
        <div
          ref={inner}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseMove={onTouchMove}
          onMouseDown={onTouchStart}
          onMouseUp={onTouchEnd}
          onMouseLeave={onTouchEnd}
          onClick={onClick}
          style={{
            display: "flex",
            flexDirection: "row",
            transform: `translateX(${offset}px)`,
            transition: `transform ${transition}ms ease`
          }}
        >
          {slides}
        </div>
      </div>
    )
  });
};

export default forwardRef(Carousel);
