import React from "react";

interface Options {
  infinite: boolean;
  slidesToShow: number;
  mode: "flex" | "fixed";
}

function useSlides(
  children: React.ReactElement,
  { infinite, slidesToShow, mode = "flex" }: Options
) {
  return React.useMemo(() => {
    const originalSlides = React.Children.toArray(children);
    const slideCount = originalSlides.length;

    const preSlides = infinite
      ? originalSlides.slice(slideCount - (slidesToShow + 2))
      : [];
    const postSlides = infinite
      ? originalSlides.slice(0, slidesToShow + 2)
      : [];

    if (mode === "flex") {
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
    } else {
      const slides = [...preSlides, ...originalSlides, ...postSlides].map(
        (child: React.ReactElement, index) =>
          React.cloneElement(child, { key: index })
      );

      return {
        slides,
        slideCount,
        preSlidesCount: preSlides.length
      };
    }
  }, [children, infinite, slidesToShow]);
}

export default useSlides;
