import { motion, useReducedMotion } from "framer-motion";
import { useScrollProgress } from "../../hooks/useScrollProgress";

const ScrollProgress = () => {
  const progress = useScrollProgress();
  const reduce = useReducedMotion();

  return (
    <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-transparent">
      <motion.div
        className="h-full origin-left bg-gold/70"
        style={{ scaleX: reduce ? 0 : progress }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: reduce ? 0 : progress }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
};

export default ScrollProgress;
