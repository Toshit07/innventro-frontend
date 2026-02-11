import { AnimatePresence, motion } from "framer-motion";

const FlyToCart = ({ trigger, onComplete }) => (
  <AnimatePresence>
    {trigger && (
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[80] h-3 w-3 rounded-full bg-gold/80"
        initial={{
          opacity: 0.8,
          x: trigger.start.x,
          y: trigger.start.y,
          scale: 1
        }}
        animate={{
          opacity: 0,
          x: trigger.end.x,
          y: trigger.end.y,
          scale: 0.4
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={onComplete}
      />
    )}
  </AnimatePresence>
);

export default FlyToCart;
