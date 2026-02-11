import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import SampleKit from "./pages/SampleKit";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FullPageLoader from "./components/loaders/FullPageLoader";
import ScrollProgress from "./components/animations/ScrollProgress";
import LuxuryCursor from "./components/animations/LuxuryCursor";
import CartPanel from "./components/cart/CartPanel";
import FlyToCart from "./components/cart/FlyToCart";
import Toast from "./components/ui/Toast";
import { perfumes as perfumeData } from "./data/perfumes";
import {
  apiRequest,
  clearToken,
  clearUser,
  getToken,
  getUser,
  setToken,
  setUser
} from "./lib/api";

const Navigation = ({ cartCount, onCartOpen, cartRef, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/sample-kit", label: "Sample Kit" },
    { path: "/orders", label: "Orders" },
    { path: "/about", label: "About" }
  ];

  if (user) {
    links.push({ path: "/profile", label: "Profile" });
  }

  if (user?.role === "admin") {
    links.splice(4, 0, { path: "/admin", label: "Admin" });
  }

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-white/10 lux-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/Logo.png"
            alt="Laviure"
            className="h-[135px] w-auto object-contain pointer-events-none select-none"
            draggable="false"
          />
        </NavLink>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/60 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "text-gold/80" : "hover:text-white"
              }
              end={link.path === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 md:hidden"
          >
            Menu
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
            >
              Sign Out
            </button>
          )}
          <button
            ref={cartRef}
            onClick={onCartOpen}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          >
            Cart ({cartCount})
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="border-t border-white/10 bg-ink/95 px-6 py-4 md:hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
              {links.map((link) => (
                <NavLink
                  key={`mobile-${link.path}`}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "text-gold/80" : "hover:text-white"
                  }
                  end={link.path === "/"}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navType = useNavigationType();
  const direction = navType === "POP" ? "back" : "forward";
  const [initialLoading, setInitialLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [fly, setFly] = useState(null);
  const [sampleSelections, setSampleSelections] = useState([]);
  const [authToken, setAuthTokenState] = useState(() => getToken());
  const [authUser, setAuthUserState] = useState(() => getUser());
  const [authReady, setAuthReady] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!authToken) {
        setAuthReady(true);
        return;
      }

      try {
        const data = await apiRequest("/auth/verify", {
          method: "POST",
          token: authToken
        });
        const nextUser = data?.user || authUser;
        if (nextUser) {
          setAuthUserState(nextUser);
          setUser(nextUser);
        }
      } catch (error) {
        clearToken();
        clearUser();
        setAuthTokenState(null);
        setAuthUserState(null);
      } finally {
        setAuthReady(true);
      }
    };

    verify();
  }, [authToken, authUser]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );

  const normalizeCartItems = (items = []) =>
    items.map((item) => {
      const product = item.productId || {};
      return {
        id: product.id || product._id || item.productId || item.id,
        name: product.name || item.name || "Product",
        brand: product.brand || item.brand || "",
        price: item.price || product.price || 0,
        images: product.images || item.images || [],
        qty: item.quantity || item.qty || 1
      };
    });

  useEffect(() => {
    const loadCart = async () => {
      if (!authToken) return;
      try {
        const cart = await apiRequest("/cart", { token: authToken });
        setCartItems(normalizeCartItems(cart.items));
      } catch (error) {
        setToast(error.message || "Unable to load cart");
        setTimeout(() => setToast(""), 1600);
      }
    };

    if (authReady) {
      loadCart();
    }
  }, [authToken, authReady]);

  // Combine cart state updates with an optional fly-to-cart animation.
  const addToCart = async (perfume, event) => {
    if (event?.currentTarget && cartRef.current) {
      const startRect = event.currentTarget.getBoundingClientRect();
      const endRect = cartRef.current.getBoundingClientRect();
      setFly({
        start: {
          x: startRect.left + startRect.width / 2,
          y: startRect.top + startRect.height / 2
        },
        end: {
          x: endRect.left + endRect.width / 2,
          y: endRect.top + endRect.height / 2
        }
      });
    }

    if (authToken) {
      try {
        const productPayload = {
          id: perfume.id,
          name: perfume.name,
          brand: perfume.brand,
          description: perfume.description,
          short: perfume.short,
          price: perfume.price,
          family: perfume.family,
          occasion: perfume.occasion,
          performance: perfume.performance,
          notes: perfume.notes,
          images: perfume.images,
          exclusive: perfume.exclusive
        };
        const cart = await apiRequest("/cart/add", {
          method: "POST",
          body: {
            productId: perfume.id,
            quantity: 1,
            product: productPayload
          },
          token: authToken
        });
        setCartItems(normalizeCartItems(cart.items));
      } catch (error) {
        setToast(error.message || "Unable to add to cart");
        setTimeout(() => setToast(""), 1600);
        return;
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === perfume.id);
        if (existing) {
          return prev.map((item) =>
            item.id === perfume.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...perfume, qty: 1 }];
      });
    }

    setToast("Added to cart");
    setTimeout(() => setToast(""), 1400);
  };

  const updateCart = async (id, qty) => {
    if (authToken) {
      try {
        const cart = await apiRequest(`/cart/item/${id}`, {
          method: "PUT",
          body: { quantity: qty },
          token: authToken
        });
        setCartItems(normalizeCartItems(cart.items));
      } catch (error) {
        setToast(error.message || "Unable to update cart");
        setTimeout(() => setToast(""), 1600);
      }
      return;
    }

    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleLogout = () => {
    clearToken();
    clearUser();
    setAuthTokenState(null);
    setAuthUserState(null);
    setCartItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleAuth = (token, user) => {
    if (token) {
      setToken(token);
      setAuthTokenState(token);
    }
    if (user) {
      setUser(user);
      setAuthUserState(user);
    }
  };

  // Maintain the sample kit selection cap (max 5).
  const toggleSample = (perfume) => {
    setSampleSelections((prev) => {
      const exists = prev.find((item) => item.id === perfume.id);
      if (exists) {
        return prev.filter((item) => item.id !== perfume.id);
      }
      if (prev.length >= 5) return prev;
      return [...prev, perfume];
    });
    setToast("Sample selection updated");
    setTimeout(() => setToast(""), 1400);
  };

  return (
    <div className="min-h-screen bg-ink text-pearl">
      <ScrollProgress />
      <LuxuryCursor />
      <FullPageLoader show={initialLoading} />
      <Navigation
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        cartRef={cartRef}
        user={authUser}
        onLogout={handleLogout}
      />
      <FlyToCart trigger={fly} onComplete={() => setFly(null)} />
      <CartPanel
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdate={updateCart}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />
      <Toast message={toast} show={Boolean(toast)} />

      {/* Route transitions with direction awareness. */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Home
                direction={direction}
                perfumes={perfumeData}
                onAdd={addToCart}
                sampleHistory={sampleSelections}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop direction={direction} perfumes={perfumeData} onAdd={addToCart} />
            }
          />
          <Route
            path="/product/:id"
            element={
              <Product direction={direction} perfumes={perfumeData} onAdd={addToCart} />
            }
          />
          <Route
            path="/sample-kit"
            element={
              <SampleKit
                direction={direction}
                perfumes={perfumeData}
                selections={sampleSelections}
                onToggleSelection={toggleSample}
                onAdd={addToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart direction={direction} items={cartItems} onUpdate={updateCart} />
            }
          />
          <Route
            path="/profile"
            element={<Profile direction={direction} user={authUser} />}
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                direction={direction}
                items={cartItems}
                user={authUser}
                onClearCart={clearCart}
              />
            }
          />
          <Route
            path="/orders"
            element={<Orders direction={direction} user={authUser} />}
          />
          <Route
            path="/admin"
            element={<Admin direction={direction} user={authUser} />}
          />
          <Route path="/about" element={<About direction={direction} />} />
          <Route path="/contact" element={<Contact direction={direction} />} />
          <Route path="/faq" element={<FAQ direction={direction} />} />
          <Route path="/terms" element={<Terms direction={direction} />} />
          <Route path="/privacy" element={<Privacy direction={direction} />} />
        </Routes>
      </AnimatePresence>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-10 text-xs uppercase tracking-[0.3em] text-white/40">
          <span>LAVIURE Atelier</span>
          <span>Luxury perfume e-commerce + AI discovery</span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/50">
            <NavLink to="/about" className="hover:text-gold/70">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-gold/70">
              Contact
            </NavLink>
            <NavLink to="/faq" className="hover:text-gold/70">
              FAQ
            </NavLink>
            <NavLink to="/terms" className="hover:text-gold/70">
              Terms
            </NavLink>
            <NavLink to="/privacy" className="hover:text-gold/70">
              Privacy
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
