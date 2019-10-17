import React from "react";
import useTouch from "./useTouch";
import useSlides from "./useSlides";
import useNavigation from "./useNavigation";
import useItemSize from "./useItemSize";

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
  render: (props: RenderProps) => React.ReactElement;
}

const Carousel: React.FC<CarouselProps> = (
  {
    children,
    slidesToShow = 3,
    infinite = true,
    transitionDuration = 300,
    centerCurrentSlide = false,
    render = ({ slides }: RenderProps) => slides
  },
  ref: () => void
) => {
  const { slides, slideCount, preSlidesCount } = useSlides(children, {
    infinite,
    slidesToShow,
    mode: "flex"
  });

  const navigation = useNavigation({
    infinite,
    slidesToShow,
    slideCount
  });

  const { previous, next, goToStep, currentIndex } = navigation;

  React.useImperativeHandle(
    ref,
    () => ({
      previous,
      next,
      goToStep
    }),
    [previous, next]
  );

  const wrapper = React.useRef(null);
  const [itemSize, setItemSize] = React.useState(0);
  const [disableTransition, setDisableTransition] = React.useState(false);

  useItemSize({
    wrapper,
    callback: size => {
      if (itemSize !== size) {
        setDisableTransition(true);
        setItemSize(size);
      }
    },
    slidesToShow,
    measure: "width",
    mode: "flex"
  });

  React.useEffect(() => {
    if (disableTransition) {
      if (currentIndex < 0 || currentIndex >= slideCount) {
        requestAnimationFrame(() =>
          navigation.goToStep(index => {
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
    onClickCapture
  } = useTouch(
    React.useCallback(
      offset => {
        // Make it a bit easier to switch slides by adding 30% of item size to the offset
        const adjustedOffset =
          offset > 0 ? offset + itemSize * 0.3 : offset - itemSize * 0.3;
        const slidesMoved = Math.round(adjustedOffset / itemSize);
        if (infinite) {
          navigation.goToStep(index => index - slidesMoved);
        } else {
          if (slidesMoved === 0) return;
          navigation.goToStep(prevIndex => {
            if (prevIndex - slidesMoved > slideCount - slidesToShow)
              return slideCount - slidesToShow;
            if (prevIndex - slidesMoved < 0) {
              return 0;
            }
            return prevIndex - slidesMoved;
          });
        }
      },
      [itemSize, slideCount, slidesToShow, navigation.goToStep]
    )
  );

  const centeringOffset = centerCurrentSlide
    ? (slidesToShow / 2 - 0.5) * itemSize
    : 0;
  const offset =
    touchOffset - (currentIndex + preSlidesCount) * itemSize + centeringOffset;
  const transition = disableTransition || isTouching ? 0 : transitionDuration;

  return render({
    ...navigation,
    slides: (
      <div
        style={{
          width: "100%",
          overflow: "hidden"
        }}
        ref={wrapper}
      >
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onMouseLeave={onTouchEnd}
          onClickCapture={onClickCapture}
          style={{
            display: "flex",
            flexDirection: "row",
            transform: `translateX(${offset}px)`,
            transition: `transform ${transition}ms ease`,
            touchAction: "pan-y pinch-zoom"
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
