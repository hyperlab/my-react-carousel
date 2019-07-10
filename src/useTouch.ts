import { default as React } from "react";

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
    const preventDefault = (event: TouchEvent) => {
      if (
        event.changedTouches.length === 1 &&
        isSwiping.current &&
        event.cancelable
      ) {
        event.preventDefault();
        event.returnValue = false;
        return false;
      }
    };

    document.addEventListener("touchmove", preventDefault, {
      passive: false
    });

    return () => document.removeEventListener("touchmove", preventDefault);
  }, [isSwiping]);

  const onTouchStart = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (
        (event as React.TouchEvent).targetTouches &&
        (event as React.TouchEvent).targetTouches.length > 1
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
        if (!isSwiping.current) {
          if (Math.abs(diffY) > 10) {
            reset();
          } else {
            isSwiping.current = Math.abs(diffX) > 5;
          }
        }
      }
    },
    [touchStartX, touchStartY, isSwiping]
  );

  const onTouchEnd = React.useCallback(() => {
    if (isSwiping.current) callback(touchOffset);
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
