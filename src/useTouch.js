import { useState, useCallback } from "react";

function useTouch(callback) {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const onTouchStart = useCallback(event => {
    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;

    setTouchStartX(x);
  }, []);

  const onTouchMove = useCallback(
    event => {
      if (touchStartX !== null) {
        const x = event.changedTouches
          ? event.changedTouches[0].clientX
          : event.clientX;

        setTouchOffset(x - touchStartX);
      }
    },
    [touchStartX]
  );

  const onTouchEnd = useCallback(() => {
    callback(touchOffset);
    setTouchStartX(null);
    setTimeout(() => setTouchOffset(0), 0);
  }, [touchOffset, callback]);

  const onClick = useCallback(
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
