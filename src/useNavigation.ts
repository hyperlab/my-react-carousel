import React from "react";

interface Options {
  infinite: boolean;
  slidesToShow: number;
  slideCount: number;
}

function useNavigation({ infinite, slidesToShow, slideCount }: Options) {
  const [currentIndex, setIndex] = React.useState(0);
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

  const currentStep =
    currentIndex >= slideCount
      ? currentIndex - slideCount
      : currentIndex < 0
      ? currentIndex + slideCount
      : currentIndex;
  const totalSteps = infinite ? slideCount : slideCount - slidesToShow + 1;

  return {
    previous,
    next,
    hasNext: infinite ? true : currentIndex + slidesToShow < slideCount,
    hasPrevious: infinite ? true : currentIndex > 0,
    currentIndex,
    currentStep,
    totalSteps,
    goToStep: setIndex
  };
}

export default useNavigation;
