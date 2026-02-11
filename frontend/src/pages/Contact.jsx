import { useState } from "react";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Contact = ({ direction }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("Please complete all fields.");
      return;
    }
    setStatus("Message sent. Our concierge team will reply shortly.");
  };

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Contact"
          title="Speak with the atelier"
          description="Reach our concierge team for sampling, corporate gifting, or account support."
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="grid gap-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <label className="flex w-full flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
                Message
                <textarea
                  className="min-h-[140px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-pearl outline-none transition-none focus:border-gold/60"
                  value={form.message}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                />
              </label>
              <Button type="submit">Send message</Button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-sm text-white/70">
            <h3 className="font-display text-2xl">Concierge hours</h3>
            <p className="mt-4">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
            <p className="mt-2">Concierge: concierge@innoventure.com</p>
            <p className="mt-2">Press: press@innoventure.com</p>
            <p className="mt-2">Phone: +1 (212) 555-0148</p>
          </div>
        </div>

        {status && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs uppercase tracking-[0.3em] text-gold/80">
            {status}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Contact;
