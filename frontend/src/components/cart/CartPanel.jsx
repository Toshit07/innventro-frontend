import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";

const CartPanel = ({ open, items, onClose, onUpdate, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.aside
            className="h-full w-full max-w-md border-l border-white/10 bg-ink p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">Cart</h3>
              <button
                className="text-xs uppercase tracking-[0.3em] text-white/60"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {items.length === 0 && (
                <p className="text-sm text-white/60">Your cart is empty.</p>
              )}
              {items.map((item) => (
                <div
                  key={`cart-${item.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80"}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {item.brand}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        className="rounded-full border border-white/10 px-2 py-1"
                        onClick={() => onUpdate(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="rounded-full border border-white/10 px-2 py-1"
                        onClick={() => onUpdate(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gold/80">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Total</span>
                <span className="text-lg text-gold/80">₹{total.toFixed(2)}</span>
              </div>
              <Button className="mt-4 w-full" onClick={onCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
