import { useEffect, useState } from "react";

export const useCursor = () => {
  const [cursor, setCursor] = useState({
    x: -100,
    y: -100,
    active: false,
    hovering: false
  });

  useEffect(() => {
    const onMove = (event) => {
      setCursor((prev) => ({
        ...prev,
        x: event.clientX,
        y: event.clientY,
        active: true
      }));
    };

    const onLeave = () => setCursor((prev) => ({ ...prev, active: false }));

    const onOver = (event) => {
      const target = event.target;
      const interactive = target?.closest?.(
        "a, button, input, textarea, select"
      );
      setCursor((prev) => ({ ...prev, hovering: Boolean(interactive) }));
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return cursor;
};
