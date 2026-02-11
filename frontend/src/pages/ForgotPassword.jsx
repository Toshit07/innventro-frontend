import { useState } from "react";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const ForgotPassword = ({ direction }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setMessage("Reset instructions will be sent if the account exists.");
  };

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Account"
          title="Reset your password"
          description="Enter your email and we will guide you through a secure reset."
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="grid gap-4">
            <Input
              label="Email"
              placeholder="you@laviure.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit">Send reset link</Button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs uppercase tracking-[0.3em] text-gold/80">
              {message}
            </div>
          )}
        </form>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
