import { motion, useReducedMotion } from "framer-motion";

const PerformanceBar = ({ label, value }) => {
  const reduce = useReducedMotion();
  const scaleValue = Math.min(Math.max(value / 100, 0), 1);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>{label}</span>
        <span className="text-gold/70">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-gold/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: reduce ? scaleValue : scaleValue }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const PerformanceBars = ({ longevity, projection }) => (
  <div className="flex flex-col gap-4">
    <PerformanceBar label="Longevity" value={longevity} />
    <PerformanceBar label="Projection" value={projection} />
  </div>
);

export default PerformanceBars;
