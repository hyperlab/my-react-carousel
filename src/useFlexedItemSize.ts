import React from "react";

interface Options {
  wrapper: React.MutableRefObject<HTMLDivElement>;
  callback: (size: number) => void;
  measure: "width" | "height";
  slidesToShow: number;
}

function useFlexedItemSize({
  wrapper,
  callback,
  measure,
  slidesToShow
}: Options) {
  const updateItemSize = React.useCallback(
    () =>
      requestAnimationFrame(() => {
        if (wrapper.current) {
          const rect = wrapper.current.getBoundingClientRect();
          callback(Math.round(rect[measure] / slidesToShow));
        }
      }),
    [slidesToShow]
  );

  React.useLayoutEffect(() => {
    updateItemSize();
    window.addEventListener("resize", updateItemSize);
    return () => window.removeEventListener("resize", updateItemSize);
  }, [updateItemSize]);
}

export default useFlexedItemSize;
