import { default as React } from "react";

function useTouch(callback: (offset: number) => void) {
  const [touchStartX, setTouchStartX] = React.useState(null);
  const [touchStartY, setTouchStartY] = React.useState(null);
  const [touchOffset, setTouchOffset] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);

  React.useEffect(() => {
    const preventDefault = (event: TouchEvent) => {
      if (isSwiping && event.cancelable) {
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

      setTouchStartX(x);
      setTouchStartY(y);
    },
    []
  );

  const onTouchMove = React.useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (touchStartX !== null) {
        const x = (event as React.TouchEvent).changedTouches
          ? (event as React.TouchEvent).changedTouches[0].clientX
          : (event as React.MouseEvent).clientX;
        const y = (event as React.TouchEvent).changedTouches
          ? (event as React.TouchEvent).changedTouches[0].clientY
          : (event as React.MouseEvent).clientY;

        const diffX = x - touchStartX;
        const diffY = y - touchStartY;

        setTouchOffset(diffX);
        if (!isSwiping) {
          if (Math.abs(diffY) > 10) {
            setTouchStartX(null);
            setTouchStartY(null);
            setTouchOffset(0);
          } else {
            setIsSwiping(Math.abs(diffX) > 5);
          }
        }
      }
    },
    [touchStartX, isSwiping]
  );

  const onTouchEnd = React.useCallback(() => {
    callback(touchOffset);
    setTouchStartX(null);
    setIsSwiping(false);
    setTimeout(() => setTouchOffset(0), 0);
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
    isTouching: touchStartX !== null,
    touchOffset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick
  };
}

export default useTouch;
