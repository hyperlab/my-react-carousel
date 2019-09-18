import React from "react";
import useSlides from "./useSlides";
import useItemSize from "./useItemSize";
import useNavigation from "./useNavigation";

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
}

export interface VerticalCarouselProps {
  children: React.ReactElement;
  slidesToShow: number;
  infinite: boolean;
  transitionDuration: number;
  render: (props: RenderProps) => React.ReactElement;
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = (
  {
    children,
    slidesToShow = 3,
    infinite = true,
    transitionDuration = 300,
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
    measure: "height",
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

  const offset = 0 - (currentIndex + preSlidesCount) * itemSize;
  const transition = disableTransition || transitionDuration;

  return render({
    ...navigation,
    slides: (
      <div
        style={{
          width: "auto",
          height: "100%",
          overflow: "hidden"
        }}
        ref={wrapper}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            transform: `translateY(${offset}px)`,
            transition: `transform ${transition}ms ease`
          }}
        >
          {slides}
        </div>
      </div>
    ),
    slidesToShow,
    infinite,
    transitionDuration
  });
};

export default React.forwardRef(VerticalCarousel);
