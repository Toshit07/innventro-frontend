import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { apiRequest, getToken } from "../lib/api";

const Checkout = ({ direction, items, user, onClearCart }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [shipping, setShipping] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const finalTotal = useMemo(
    () => Math.max(0, total - discount),
    [total, discount]
  );

  const handleApplyCoupon = () => {
    if (couponApplied) {
      setErrorMessage("Coupon already applied.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Check if cart contains Sample Kit
    const hasSampleKit = items.some(item => item.name.toLowerCase().includes("sample kit"));
    if (hasSampleKit) {
      setErrorMessage("Coupon codes are not applicable on Sample Kit products.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const validCoupons = ["LAVIURE99", "LUXE99", "ROYAL99", "SIGNATURE99", "ELIXIR99"];
    const enteredCode = couponCode.trim().toUpperCase();

    if (validCoupons.includes(enteredCode)) {
      setDiscount(99);
      setCouponApplied(true);
      setMessage("Coupon applied successfully – ₹99 discount added.");
      setTimeout(() => setMessage(""), 3000);
      setCouponCode("");
    } else {
      setErrorMessage("Invalid coupon code.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    // Validate required fields
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!shipping.street || !shipping.city || !shipping.state || !shipping.zipCode || !shipping.country) {
      setErrorMessage("Please complete all shipping details.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const token = getToken();
      const order = await apiRequest("/orders", {
        method: "POST",
        body: {
          shippingAddress: shipping,
          customerEmail: email,
          paymentMethod: "card",
          items: items.map((item) => ({ id: item.id, quantity: item.qty })),
          totalAmount: finalTotal
        },
        token
      });

      // Create payment checkout session with third-party gateway
      const paymentSession = await apiRequest("/payments/create-checkout", {
        method: "POST",
        body: { orderId: order.order._id },
        token
      });

      // Redirect to third-party payment gateway
      if (paymentSession.checkoutUrl) {
        window.location.href = paymentSession.checkoutUrl;
      } else {
        setErrorMessage("Failed to initialize payment session.");
      }
    } catch (error) {
      // Store order locally if backend fails (no authentication)
      const localOrder = {
        _id: Date.now().toString(),
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty
        })),
        totalAmount: finalTotal,
        shippingAddress: shipping,
        customerEmail: email,
        paymentMethod: "Cash on Delivery",
        orderStatus: "processing",
        paymentStatus: "pending",
        createdAt: new Date().toISOString()
      };
      
      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem("innoventure_orders") || "[]");
      existingOrders.unshift(localOrder);
      localStorage.setItem("innoventure_orders", JSON.stringify(existingOrders));
      
      // Clear the cart after successful order
      if (onClearCart) {
        onClearCart();
      }
      
      setMessage("Order placed successfully! Cash on Delivery.");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const token = getToken();

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Checkout"
          title="Confirm your delivery"
          description="Review shipping details and submit your order."
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-display text-2xl">Contact & Shipping</h3>
            <div className="mt-6 grid gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!!user}
              />
              <Input
                label="Street"
                placeholder="123 Main Street"
                value={shipping.street}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, street: event.target.value }))
                }
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="City"
                  placeholder="New York"
                  value={shipping.city}
                  onChange={(event) =>
                    setShipping((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
                <Input
                  label="State"
                  placeholder="NY"
                  value={shipping.state}
                  onChange={(event) =>
                    setShipping((prev) => ({ ...prev, state: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Zip Code"
                  placeholder="10001"
                  value={shipping.zipCode}
                  onChange={(event) =>
                    setShipping((prev) => ({ ...prev, zipCode: event.target.value }))
                  }
                />
                <Input
                  label="Country"
                  placeholder="United States"
                  value={shipping.country}
                  onChange={(event) =>
                    setShipping((prev) => ({ ...prev, country: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Payment
              </p>
              <p className="mt-2 text-sm text-white/60">
                You will be redirected to our secure payment gateway to complete your purchase.
              </p>
            </div>

            <Button className="mt-8 w-full" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-display text-2xl">Order summary</h3>
            <div className="mt-6 grid gap-4">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/60">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`checkout-${item.id}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div>
                      <p className="font-display text-lg">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Qty {item.qty}
                      </p>
                    </div>
                    <span className="text-sm text-gold/80">
                      ₹{item.price}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-white/70">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-green-500">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-sm text-white/70">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="mt-6 flex items-center justify-between text-lg text-gold/80">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Have a coupon code?
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <Button
                  variant="ghost"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>

          </div>
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs uppercase tracking-[0.3em] text-gold/80">
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs uppercase tracking-[0.3em] text-gold/80">
            {message}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Checkout;
