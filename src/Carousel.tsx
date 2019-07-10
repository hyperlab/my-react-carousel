import { default as React } from "react";
import useTouch from "./useTouch";

export type Direction = "horizontal" | "vertical";

export interface RenderProps {
  slides: React.ReactElement;
  next: () => void;
  previous: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  totalSteps: number;
  currentStep: number;
  goToStep: (index: number) => void;
  slidesToShow: number;
  infinite: boolean;
  transitionDuration: number;
  centerCurrentSlide: boolean;
}

export interface CarouselProps {
  children: React.ReactElement;
  slidesToShow: number;
  infinite: boolean;
  transitionDuration: number;
  centerCurrentSlide: boolean;
  direction: Direction;
  render: (props: RenderProps) => React.ReactElement;
}

const Carousel: React.FC<CarouselProps> = (
  {
    children,
    slidesToShow = 3,
    infinite = true,
    transitionDuration = 300,
    centerCurrentSlide = false,
    render = ({ slides }: RenderProps) => slides,
    direction = "horizontal"
  },
  ref: () => void
) => {
  const horizontal = direction === "horizontal";

  const [currentIndex, setIndex] = React.useState(0);

  const { slides, slideCount, preSlidesCount } = React.useMemo(() => {
    const originalSlides = React.Children.toArray(children);
    const slideCount = originalSlides.length;

    const preSlides = infinite
      ? originalSlides.slice(slideCount - (slidesToShow + 2))
      : [];
    const postSlides = infinite
      ? originalSlides.slice(0, slidesToShow + 2)
      : [];

    const slides = [...preSlides, ...originalSlides, ...postSlides].map(
      (child: React.ReactElement, index) =>
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

  const previous = React.useCallback(
    () =>
      setIndex(index => {
        if (infinite || index - 1 >= 0) return index - 1;
        return 0;
      }),
    [infinite]
  );
  const next = React.useCallback(
    () =>
      setIndex(index => {
        if (infinite || index + 1 < slideCount - slidesToShow) return index + 1;
        return slideCount - slidesToShow;
      }),
    [infinite, slideCount, slidesToShow]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      previous,
      next
    }),
    [previous, next]
  );

  const inner = React.useRef(null);
  const [itemSize, setItemSize] = React.useState(0);
  const [disableTransition, setDisableTransition] = React.useState(false);

  const updateItemSize = React.useCallback(
    () =>
      requestAnimationFrame(() => {
        if (inner.current) {
          const { width, height } = inner.current.getBoundingClientRect();
          setDisableTransition(true);
          setItemSize(Math.round((horizontal ? width : height) / slidesToShow));
        }
      }),
    [slidesToShow]
  );

  React.useLayoutEffect(() => {
    updateItemSize();
    window.addEventListener("resize", updateItemSize);
    return () => window.removeEventListener("resize", updateItemSize);
  }, [updateItemSize]);

  React.useEffect(() => {
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
    React.useCallback(
      offset => {
        // Make it a bit easier to switch slides by adding 30% of item size to the offset
        const adjustedOffset =
          offset > 0 ? offset + itemSize * 0.3 : offset - itemSize * 0.3;
        const slidesMoved = Math.round(adjustedOffset / itemSize);
        if (infinite) {
          setIndex(index => index - slidesMoved);
        } else {
          if (slidesMoved === 0) return;
          setIndex(prevIndex => {
            if (prevIndex - slidesMoved > slideCount - slidesToShow)
              return slideCount - slidesToShow;
            if (prevIndex - slidesMoved < 0) {
              return 0;
            }
            return prevIndex - slidesMoved;
          });
        }
      },
      [itemSize]
    ),
    direction
  );

  const centeringOffset = centerCurrentSlide
    ? (slidesToShow / 2 - 0.5) * itemSize
    : 0;
  const offset =
    touchOffset - (currentIndex + preSlidesCount) * itemSize + centeringOffset;
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
    hasNext: infinite ? true : currentIndex + slidesToShow < slideCount,
    hasPrevious: infinite ? true : currentIndex > 0,
    totalSteps,
    currentStep,
    goToStep: setIndex,
    slides: (
      <div
        style={{
          width: horizontal ? "100%" : "auto",
          height: horizontal ? "auto" : "100%",
          overflow: "hidden"
        }}
      >
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
            flexDirection: horizontal ? "row" : "column",
            transform: horizontal
              ? `translateX(${offset}px)`
              : `translateY(${offset}px)`,
            transition: `transform ${transition}ms ease`
          }}
        >
          {slides}
        </div>
      </div>
    ),
    slidesToShow,
    infinite,
    transitionDuration,
    centerCurrentSlide
  });
};

export default React.forwardRef(Carousel);
