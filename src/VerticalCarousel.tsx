import { default as React } from "react";
import useFlexedSlides from "./useFlexedSlides";
import useFlexedItemSize from "./useFlexedItemSize";
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
  const { slides, slideCount, preSlidesCount } = useFlexedSlides(children, {
    infinite,
    slidesToShow
  });

  const navigation = useNavigation({
    infinite,
    slidesToShow,
    slideCount
  });

  const { previous, next, currentIndex } = navigation;

  React.useImperativeHandle(
    ref,
    () => ({
      previous,
      next
    }),
    [previous, next]
  );

  const wrapper = React.useRef(null);
  const [itemSize, setItemSize] = React.useState(0);
  const [disableTransition, setDisableTransition] = React.useState(false);

  useFlexedItemSize({
    wrapper,
    callback: size => {
      setDisableTransition(true);
      setItemSize(size);
    },
    slidesToShow,
    measure: "height"
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

  const offset = (currentIndex + preSlidesCount) * itemSize;
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
