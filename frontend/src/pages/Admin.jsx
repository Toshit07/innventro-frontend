import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { apiRequest, getToken } from "../lib/api";

const emptyProduct = {
  id: "",
  name: "",
  brand: "",
  price: "",
  short: "",
  description: "",
  family: "Woody",
  occasion: "Luxury",
  image: ""
};

const Admin = ({ direction, user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [statsData, ordersData, productsData] = await Promise.all([
          apiRequest("/admin/stats"),
          apiRequest("/admin/orders"),
          apiRequest("/products")
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        setMessage(error.message || "Unable to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const handleOrderStatus = async (orderId, status) => {
    try {
      const data = await apiRequest(`/admin/orders/${orderId}`, {
        method: "PUT",
        body: { orderStatus: status }
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.order : order))
      );
    } catch (error) {
      setMessage(error.message || "Unable to update order");
    }
  };

  const handleProductCreate = async () => {
    try {
      const newProduct = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: Number(product.price),
        short: product.short,
        description: product.description,
        family: product.family,
        occasion: product.occasion,
        images: product.image ? [product.image] : [],
        notes: { top: [], middle: [], base: [] },
        performance: { longevity: 70, projection: 60 }
      };

      const data = await apiRequest("/admin/products", {
        method: "POST",
        body: newProduct
      });
      setProducts((prev) => [data.product, ...prev]);
      setProduct(emptyProduct);
      setMessage("Product created successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to create product");
    }
  };

  const token = getToken();

  if (!user && !loading && !token) {
    return (
      <PageTransition direction={direction} className="lux-gradient">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-24 pt-28">
          <SectionTitle
            eyebrow="Admin"
            title="Sign in to access admin tools"
            description="Manage products, orders, and performance insights."
          />
          <Button onClick={() => navigate("/auth")}>Go to login</Button>
        </div>
      </PageTransition>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <PageTransition direction={direction} className="lux-gradient">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-24 pt-28">
          <SectionTitle
            eyebrow="Admin"
            title="Restricted access"
            description="You do not have admin permissions for this area."
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Admin"
          title="Command center"
          description="Monitor sales and manage the catalog."
        />

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Loading dashboard...
          </div>
        ) : (
          <>
            {stats && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Users", value: stats.totalUsers },
                  { label: "Products", value: stats.totalProducts },
                  { label: "Orders", value: stats.totalOrders },
                  {
                    label: "Revenue",
                    value: `$${stats.totalRevenue.toFixed(2)}`
                  }
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {card.label}
                    </p>
                    <p className="mt-3 font-display text-3xl text-gold/80">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-2xl">Recent orders</h3>
                <div className="mt-6 grid gap-4">
                  {orders.slice(0, 6).map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                            {order.userId?.name || "Client"}
                          </p>
                          <p className="mt-2 font-display text-lg">
                            ${order.totalAmount?.toFixed(2)}
                          </p>
                        </div>
                        <Badge>{order.orderStatus}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["processing", "shipped", "delivered", "cancelled"].map(
                          (status) => (
                            <button
                              key={`${order._id}-${status}`}
                              onClick={() => handleOrderStatus(order._id, status)}
                              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${
                                order.orderStatus === status
                                  ? "border-gold/60 text-gold/80"
                                  : "border-white/10 text-white/50"
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-2xl">Create product</h3>
                <div className="mt-6 grid gap-4">
                  <Input
                    label="Product ID"
                    placeholder="noir-atelier"
                    value={product.id}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, id: event.target.value }))
                    }
                  />
                  <Input
                    label="Name"
                    value={product.name}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <Input
                    label="Brand"
                    value={product.brand}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, brand: event.target.value }))
                    }
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={product.price}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, price: event.target.value }))
                    }
                  />
                  <Input
                    label="Short description"
                    value={product.short}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, short: event.target.value }))
                    }
                  />
                  <Input
                    label="Full description"
                    value={product.description}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
                      Family
                      <select
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-pearl"
                        value={product.family}
                        onChange={(event) =>
                          setProduct((prev) => ({
                            ...prev,
                            family: event.target.value
                          }))
                        }
                      >
                        {["Woody", "Floral", "Citrus", "Oriental", "Fresh", "Fruity", "Aromatic"].map(
                          (family) => (
                            <option key={family} value={family}>
                              {family}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
                      Occasion
                      <select
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-pearl"
                        value={product.occasion}
                        onChange={(event) =>
                          setProduct((prev) => ({
                            ...prev,
                            occasion: event.target.value
                          }))
                        }
                      >
                        {["Daily", "Evening", "Luxury", "Sport", "Casual"].map(
                          (occasion) => (
                            <option key={occasion} value={occasion}>
                              {occasion}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </div>
                  <Input
                    label="Image URL"
                    value={product.image}
                    onChange={(event) =>
                      setProduct((prev) => ({ ...prev, image: event.target.value }))
                    }
                  />
                </div>
                <Button className="mt-6" onClick={handleProductCreate}>
                  Add product
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-2xl">Catalog overview</h3>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {products.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div>
                      <p className="font-display text-lg">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {item.brand}
                      </p>
                    </div>
                    <span className="text-sm text-gold/80">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
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

export default Admin;
