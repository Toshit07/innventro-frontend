import { motion } from "framer-motion";
import { useState } from "react";
import { glowHover } from "../../animations/motionVariants";

const Button = ({
  children,
  className = "",
  variant = "primary",
  disabled,
  onClick,
  type = "button"
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (event) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = `${Date.now()}-${Math.random()}`;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() =>
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id)),
    520);
    if (onClick) onClick(event);
  };

  const baseStyles =
    "relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-none";
  const variants = {
    primary: "bg-ink text-pearl border border-white/10",
    ghost: "bg-transparent text-pearl border border-white/20"
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-40" : ""} ${className}`}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full bg-gold/20 blur-2xl"
        variants={glowHover}
      />
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ opacity: 0.3, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
