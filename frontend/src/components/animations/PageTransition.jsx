import { motion, useReducedMotion } from "framer-motion";
import { routeVariants } from "../../animations/motionVariants";

const PageTransition = ({ direction, className = "", children }) => {
  const reduce = useReducedMotion();
  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }
      }
    : routeVariants;

  return (
    <motion.main
      className={`min-h-screen w-full ${className}`}
      variants={variants}
      custom={direction}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.main>
  );
};

export default PageTransition;
