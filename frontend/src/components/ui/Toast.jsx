import { AnimatePresence, motion } from "framer-motion";

const Toast = ({ message, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed bottom-6 right-6 z-[90] rounded-full border border-gold/40 bg-ink px-5 py-3 text-xs uppercase tracking-[0.3em] text-gold/80"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Toast;
