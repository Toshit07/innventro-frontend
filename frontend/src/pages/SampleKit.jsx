import { motion } from "framer-motion";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

const SampleKit = ({
  direction,
  perfumes,
  selections,
  onToggleSelection,
  onAdd
}) => {
  const min = 3;
  const max = 5;
  const count = selections.length;
  const progress = Math.min(count / min, 1);

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Try Before You Buy"
          title="Sample Strip Kit"
          description="Select 3-5 perfumes. Each strip includes name, brand, and a QR code for instant purchase."
        />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                Selection
              </p>
              <p className="mt-2 font-display text-2xl">
                {count} / {max} selected
              </p>
            </div>
            <div className="w-full max-w-sm">
              <div className="h-2 w-full rounded-full bg-white/10">
                <motion.div
                  className="h-full w-full origin-left rounded-full bg-gold/70"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                Minimum {min} required
              </p>
            </div>
            <Button 
              disabled={count < min}
              onClick={(event) => {
                const sampleKit = {
                  id: "sample-kit-" + Date.now(),
                  name: "Sample Kit",
                  brand: "LAVIURE",
                  price: 99,
                  images: ["/Samplekit.png"],
                  short: `Sample kit with ${count} perfumes: ` + selections.map(p => p.name).join(", "),
                  description: `Sample kit containing ${count} perfumes`,
                  family: "Fresh",
                  occasion: "Daily",
                  performance: { longevity: 0, projection: 0 },
                  notes: { top: [], middle: [], base: [] },
                  exclusive: false
                };
                onAdd(sampleKit, event);
              }}
            >
              Add Sample Kit to Cart (₹99)
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {perfumes.map((perfume) => {
            const active = selections.some((item) => item.id === perfume.id);
            return (
              <motion.button
                key={`sample-${perfume.id}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => onToggleSelection(perfume)}
                className={`flex flex-col gap-4 rounded-3xl border p-4 text-left transition-none ${
                  active
                    ? "border-gold/60 bg-gold/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <img
                  src={perfume.images[0]}
                  alt={perfume.name}
                  className="h-48 w-full rounded-2xl object-cover"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl">{perfume.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {perfume.brand}
                    </p>
                  </div>
                  <span className="text-sm text-gold/80">₹{perfume.price}</span>
                </div>
                <p className="text-sm text-white/70">{perfume.short}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {perfume.family}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {perfume.occasion}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default SampleKit;
