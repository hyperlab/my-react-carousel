import { RenderProps } from "./Carousel";
import { ReactElement } from "react";

export interface Dot {
  index: number;
  onClick: () => void;
  isActive: boolean;
}

export interface RenderPropsWithDots extends RenderProps {
  dots: Dot[];
}

export function findClosestPath(source: number, end: number, total: number) {
  const forward = end + total;
  const backward = end - total;

  const forwardDiff = Math.abs(forward - source);
  const backwardDiff = Math.abs(source - backward);
  const directDiff = Math.abs(end - source);

  if (forwardDiff < directDiff) {
    return forward;
  } else if (backwardDiff < directDiff) {
    return backward;
  } else {
    return end;
  }
}

export function generateDots(
  render: (props: RenderPropsWithDots) => ReactElement
) {
  return (props: RenderProps) => {
    const { currentStep, totalSteps, goToStep } = props;
    const dots = Array.from(Array(totalSteps)).map((_, index) => ({
      index,
      onClick: () => goToStep(findClosestPath(currentStep, index, totalSteps)),
      isActive: index === currentStep
    }));

    return render({
      dots,
      ...props
    });
  };
}
