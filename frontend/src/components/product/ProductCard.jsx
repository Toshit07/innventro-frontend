import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const ProductCard = ({ perfume, onAdd }) => (
  <motion.article
    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
    initial="rest"
    whileHover="hover"
    animate="rest"
  >
    <motion.div
      className="absolute inset-0 rounded-3xl shadow-card"
      variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
    <motion.div
      className="absolute inset-0 rounded-3xl border border-gold/20"
      variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
    <Link
      to={`/product/${perfume.id}`}
      className="relative block overflow-hidden rounded-2xl"
    >
      <motion.img
        src={perfume.images[0]}
        alt={perfume.name}
        className="h-64 w-full object-cover"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {perfume.exclusive && (
        <div className="absolute left-4 top-4">
          <Badge>Sample Exclusive</Badge>
        </div>
      )}
    </Link>

    <div className="mt-4 flex flex-1 flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/product/${perfume.id}`}>
            <h3 className="font-display text-xl">{perfume.name}</h3>
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            {perfume.brand}
          </p>
        </div>
        <span className="text-sm text-gold/80">₹{perfume.price}</span>
      </div>

      <p className="text-sm text-white/65">{perfume.short}</p>

      <motion.div
        className="h-[2px] w-12 bg-gold/60"
        variants={{ rest: { opacity: 0.2, scaleX: 0.5 }, hover: { opacity: 1, scaleX: 1 } }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <motion.div
        className="mt-auto translate-y-4"
        variants={{ rest: { opacity: 0, y: 16 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Button onClick={(event) => onAdd(perfume, event)}>Add to Cart</Button>
      </motion.div>
    </div>
  </motion.article>
);

export default ProductCard;
