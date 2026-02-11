import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const ProductGallery = ({ images = [] }) => {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={current}
            alt="Perfume"
            className="h-[420px] w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-2xl border ${
              active === index ? "border-gold/60" : "border-white/10"
            }`}
          >
            <img
              src={image}
              alt={`Perfume ${index + 1}`}
              className="h-20 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
