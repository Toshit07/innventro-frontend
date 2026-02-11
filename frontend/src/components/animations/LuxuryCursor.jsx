import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useCursor } from "../../hooks/useCursor";

const LuxuryCursor = () => {
  const reduce = useReducedMotion();
  const cursor = useCursor();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("lux-cursor");
    return () => document.body.classList.remove("lux-cursor");
  }, [enabled]);

  const variants = useMemo(
    () => ({
      default: {
        opacity: cursor.active ? 1 : 0,
        scale: cursor.hovering ? 1.25 : 1,
        x: cursor.x - 16,
        y: cursor.y - 16
      },
      reduced: {
        opacity: 0
      }
    }),
    [cursor]
  );

  if (!enabled || reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-gold/50"
      variants={variants}
      animate={reduce ? "reduced" : "default"}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="h-full w-full rounded-full bg-gold/10" />
    </motion.div>
  );
};

export default LuxuryCursor;
