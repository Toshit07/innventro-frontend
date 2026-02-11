import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { apiRequest, getToken } from "../lib/api";

const Orders = ({ direction, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/orders");
        setOrders(data);
      } catch (error) {
        setMessage(error.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const data = await apiRequest(`/orders/${orderId}/cancel`, {
        method: "PUT"
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.order : order))
      );
    } catch (error) {
      setMessage(error.message || "Unable to cancel order");
    }
  };

  const token = getToken();

  if (!user && !loading && !token) {
    return (
      <PageTransition direction={direction} className="lux-gradient">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-24 pt-28">
          <SectionTitle
            eyebrow="Orders"
            title="Sign in to view your orders"
            description="Track shipments, manage returns, and revisit your signature scents."
          />
          <Button onClick={() => navigate("/auth")}>Go to login</Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Orders"
          title="Your purchase history"
          description="Track each shipment and manage order updates."
        />

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Your order history is empty.
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="mt-2 font-display text-2xl">
                      ${order.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{order.orderStatus}</Badge>
                    <Badge>{order.paymentStatus}</Badge>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {order.items.map((item) => (
                    <div
                      key={`${order._id}-${item.productId}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <div>
                        <p className="font-display text-lg">{item.name}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm text-gold/80">
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {order.orderStatus === "processing" && (
                  <Button
                    className="mt-6"
                    variant="ghost"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel order
                  </Button>
                )}
              </div>
            ))}
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

export default Orders;
