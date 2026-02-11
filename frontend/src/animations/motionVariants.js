export const routeVariants = {
  initial: (direction = "forward") => ({
    opacity: 0,
    y: direction === "back" ? -12 : 12
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: (direction = "forward") => ({
    opacity: 0,
    y: direction === "back" ? 12 : -12,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const glowHover = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.4, ease: "easeOut" } }
};
