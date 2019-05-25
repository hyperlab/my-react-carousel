import {
  useState,
  useCallback,
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent
} from "react";

function useTouch(callback: (offset: number) => void) {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const onTouchStart = useCallback(
    (event: ReactTouchEvent | ReactMouseEvent) => {
      const x = (event as ReactTouchEvent).changedTouches
        ? (event as ReactTouchEvent).changedTouches[0].clientX
        : (event as ReactMouseEvent).clientX;

      setTouchStartX(x);
    },
    []
  );

  const onTouchMove = useCallback(
    (event: ReactTouchEvent | ReactMouseEvent) => {
      if (touchStartX !== null) {
        const x = (event as ReactTouchEvent).changedTouches
          ? (event as ReactTouchEvent).changedTouches[0].clientX
          : (event as ReactMouseEvent).clientX;

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
