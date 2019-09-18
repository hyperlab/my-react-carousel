import React from "react";

interface Options {
  wrapper: React.MutableRefObject<HTMLDivElement>;
  callback: (size: number) => void;
  measure: "width" | "height";
  slidesToShow: number;
  mode: "flex" | "fixed";
}

function useItemSize({
  wrapper,
  callback,
  measure,
  slidesToShow,
  mode = "flex"
}: Options) {
  const updateItemSize = React.useCallback(
    () =>
      requestAnimationFrame(() => {
        if (wrapper.current) {
          if (mode === "flex") {
            const rect = wrapper.current.getBoundingClientRect();
            callback(Math.round(rect[measure] / slidesToShow));
          } else if (mode === "fixed") {
            const inner = wrapper.current.children[0];

            // Make sure there's any slides to measure
            if (inner.children.length > 0) {
              const firstSlide = inner.children[0];
              const rect = firstSlide.getBoundingClientRect();
              callback(rect[measure]);
            }
          }
        }
      }),
    [slidesToShow, callback]
  );

  React.useLayoutEffect(() => {
    updateItemSize();
    window.addEventListener("resize", updateItemSize);
    return () => window.removeEventListener("resize", updateItemSize);
  });
}

export default useItemSize;
