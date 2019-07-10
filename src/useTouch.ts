import React from "react";
import { isIosDevice } from "./isIosDevice";

function useTouch(callback: (offset: number) => void) {
  const isSwiping = React.useRef(false);
  const touchStartX = React.useRef(null);
  const touchStartY = React.useRef(null);
  const [touchOffset, setTouchOffset] = React.useState(0);

  const reset = () => {
    setTimeout(() => setTouchOffset(0), 0);
    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  React.useEffect(() => {
    if (isIosDevice) {
      const preventDefault = (event: TouchEvent) => {
        if (event.touches.length === 1 && isSwiping.current) {
          if (event.cancelable) {
            event.preventDefault();
          } else {
            reset();
          }
        }
      };

      document.addEventListener("touchmove", preventDefault, {
        passive: false
      });

      return () => {
        document.removeEventListener("touchmove", preventDefault);
      };
    }
  }, []);

  const onTouchStart = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (
        (event as React.TouchEvent).changedTouches &&
        (event as React.TouchEvent).changedTouches.length > 1
      ) {
        // Multiple touch points indicates an attempt to pinch-to-zoom
        return null;
      }

      const x = (event as React.TouchEvent).changedTouches
        ? (event as React.TouchEvent).changedTouches[0].clientX
        : (event as React.MouseEvent).clientX;
      const y = (event as React.TouchEvent).changedTouches
        ? (event as React.TouchEvent).changedTouches[0].clientY
        : (event as React.MouseEvent).clientY;

      touchStartX.current = x;
      touchStartY.current = y;
    },
    []
  );

  const onTouchMove = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (touchStartX.current !== null) {
        if (
          (event as React.TouchEvent).changedTouches &&
          (event as React.TouchEvent).changedTouches.length > 1
        ) {
          reset();
        }

        const x = (event as React.TouchEvent).changedTouches
          ? (event as React.TouchEvent).changedTouches[0].clientX
          : (event as React.MouseEvent).clientX;
        const y = (event as React.TouchEvent).changedTouches
          ? (event as React.TouchEvent).changedTouches[0].clientY
          : (event as React.MouseEvent).clientY;

        const diffX = x - touchStartX.current;
        const diffY = y - touchStartY.current;
        setTouchOffset(diffX);

        if (isIosDevice && isSwiping.current) {
          event.stopPropagation();
        }

        if (!isSwiping.current) {
          if (Math.abs(diffY) > 10 * window.devicePixelRatio) {
            reset();
          } else if (Math.abs(diffX) > 5 * window.devicePixelRatio) {
            isSwiping.current = true;
          }
        }
      }
    },
    [touchStartX]
  );

  const onTouchEnd = React.useCallback(() => {
    callback(touchOffset);
    reset();
  }, [touchOffset, callback]);

  const onClick = React.useCallback(
    event => {
      if (touchOffset !== 0) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [touchOffset]
  );

  return {
    isTouching: touchStartX.current !== null,
    touchOffset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick
  };
}

export default useTouch;
