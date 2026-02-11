import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import CartSkeleton from "../components/loaders/CartSkeleton";

const Cart = ({ direction, items, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [items.length]);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Cart"
          title="Your curated selection"
          description="Checkout is mocked for the prototype."
        />

        {loading ? (
          <CartSkeleton />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-4">
              {items.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                  Your cart is currently empty.
                </div>
              )}
              {items.map((item) => (
                <div
                  key={`cart-page-${item.id}`}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80"}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {item.brand}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        className="rounded-full border border-white/10 px-3 py-1"
                        onClick={() => onUpdate(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="rounded-full border border-white/10 px-3 py-1"
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

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                Summary
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-white/70">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="mt-6 flex items-center justify-between text-lg text-gold/80">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Button className="mt-6 w-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Cart;
