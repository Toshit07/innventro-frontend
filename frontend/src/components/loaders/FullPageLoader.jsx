import { AnimatePresence, motion } from "framer-motion";

const FullPageLoader = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="h-[2px] w-28 bg-gold/70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.35em] text-gold/70"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-[10px] tracking-[0.2em] text-gold/80">
              L
            </span>
            <span>LAVIURE</span>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FullPageLoader;
