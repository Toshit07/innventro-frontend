import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { apiRequest, setToken, setUser } from "../lib/api";

const Auth = ({ direction, onAuth, user }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorKey, setErrorKey] = useState(0);

  const triggerError = (message) => {
    setError(message);
    setSuccess("");
    setErrorKey((prev) => prev + 1);
  };

  const handleLogin = async () => {
    if (!login.email || !login.password) {
      triggerError("Please complete your credentials.");
      return;
    }

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: login
      });
      setToken(data.accessToken);
      setUser(data.user);
      if (onAuth) onAuth(data.accessToken, data.user);
      setSuccess("Welcome back.");
      setError("");
    } catch (err) {
      triggerError(err.message || "Unable to sign in");
    }
  };

  const handleRegister = async () => {
    if (!register.name || !register.email || !register.password) {
      triggerError("Please complete the registration form.");
      return;
    }

    if (register.password !== register.confirmPassword) {
      triggerError("Passwords do not match.");
      return;
    }

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: register
      });
      setToken(data.accessToken);
      setUser(data.user);
      if (onAuth) onAuth(data.accessToken, data.user);
      setSuccess("Account created successfully.");
      setError("");
    } catch (err) {
      triggerError(err.message || "Unable to register");
    }
  };

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Account"
          title="Private access"
          description="Login or register to save your scent archive and samples."
          align="center"
        />

        {user && (
          <div className="mx-auto rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold/80">
            You are signed in as {user.email}.
          </div>
        )}

        <div className="flex justify-center">
          <div className="w-full max-w-lg" style={{ perspective: 1200 }}>
            <motion.div
              className="relative h-[460px] w-full"
              animate={{ rotateY: isRegister ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 p-8"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h3 className="font-display text-2xl">Login</h3>
                <div className="mt-6 flex flex-col gap-4">
                  <Input
                    label="Email"
                    placeholder="you@laviure.com"
                    value={login.email}
                    onChange={(event) =>
                      setLogin((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••"
                    value={login.password}
                    onChange={(event) =>
                      setLogin((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                  <NavLink
                    to="/forgot"
                    className="text-xs uppercase tracking-[0.3em] text-white/50"
                  >
                    Forgot password?
                  </NavLink>
                  <Button className="mt-4 w-full" onClick={handleLogin}>
                    Enter Atelier
                  </Button>
                </div>
                <button
                  className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/70"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Create an account
                </button>
              </div>

              <div
                className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 p-8"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <h3 className="font-display text-2xl">Register</h3>
                <div className="mt-6 flex flex-col gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={register.name}
                    onChange={(event) =>
                      setRegister((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <Input
                    label="Email"
                    placeholder="you@laviure.com"
                    value={register.email}
                    onChange={(event) =>
                      setRegister((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={register.password}
                    onChange={(event) =>
                      setRegister((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    value={register.confirmPassword}
                    onChange={(event) =>
                      setRegister((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value
                      }))
                    }
                  />
                  <Button className="mt-4 w-full" onClick={handleRegister}>
                    Create Account
                  </Button>
                </div>
                <button
                  className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/70"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Back to login
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {error && (
          <motion.div
            key={errorKey}
            className="mx-auto rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold/80"
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <div className="mx-auto rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold/80">
            {success}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Auth;
