import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import ProductGallery from "../components/product/ProductGallery";
import NotesList from "../components/product/NotesList";
import PerformanceBars from "../components/product/PerformanceBars";
import SimilarCarousel from "../components/product/SimilarCarousel";
import ProductDetailSkeleton from "../components/loaders/ProductDetailSkeleton";
import ReviewSkeleton from "../components/loaders/ReviewSkeleton";

const sizeOptions = [
  { label: "50ml", multiplier: 1 },
  { label: "100ml", multiplier: 1.5 },
  { label: "200ml", multiplier: 2.3 }
];

const Product = ({ direction, perfumes, onAdd }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const perfume = perfumes.find((item) => item.id === id) || perfumes[0];
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(sizeOptions[0]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [id]);

  const price = useMemo(() => {
    return Math.round(perfume.price * size.multiplier);
  }, [perfume.price, size]);

  const handleAdd = (event) => {
    const sized = {
      ...perfume,
      id: `${perfume.id}-${size.label}`,
      name: `${perfume.name} ${size.label}`,
      price
    };
    onAdd(sized, event);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <PageTransition direction={direction} className="lux-gradient">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-28">
          <ProductDetailSkeleton />
          <ReviewSkeleton />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-28">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductGallery images={perfume.images} />
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                {perfume.brand}
              </p>
              <h1 className="mt-3 font-display text-4xl">{perfume.name}</h1>
              <p className="mt-3 text-sm text-white/70">{perfume.description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                Select Size
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {sizeOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                      size.label === option.label
                        ? "border-gold/60 text-gold/80"
                        : "border-white/10 text-white/60"
                    }`}
                    onClick={() => setSize(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Price
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={price}
                  className="font-display text-3xl text-gold/80"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  ₹{price}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Button onClick={handleAdd}>Add to Cart</Button>
              <Button variant="ghost" onClick={(event) => {
                handleAdd(event);
                setTimeout(() => navigate("/checkout"), 500);
              }}>Buy Now</Button>
            </div>

            <AnimatePresence>
              {added && (
                <motion.div
                  className="rounded-2xl border border-gold/30 bg-gold/10 p-3 text-xs uppercase tracking-[0.3em] text-gold/80"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  Added to cart
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="grid gap-6">
          <SectionTitle
            eyebrow="Fragrance Notes"
            title="Top, middle, base"
            description="Sequentially revealed for sensory clarity."
          />
          <NotesList notes={perfume.notes} />
        </section>

        <section className="grid gap-6">
          <SectionTitle
            eyebrow="Performance"
            title="Longevity and projection"
            description="Balanced for refined presence."
          />
          <PerformanceBars
            longevity={perfume.performance.longevity}
            projection={perfume.performance.projection}
          />
        </section>

        <section className="grid gap-6">
          <SectionTitle
            eyebrow="Similar Perfumes"
            title="Aligned with your selection"
            description="Curated to match tone and depth."
          />
          <SimilarCarousel
            items={perfumes.filter((item) => item.id !== perfume.id).slice(0, 5)}
            onAdd={onAdd}
          />
        </section>

        <section className="grid gap-6">
          <SectionTitle
            eyebrow="Reviews"
            title="Quiet confidence from verified buyers"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "A calm, lasting signature. The dry down is immaculate.",
              "The balance of amber and iris feels couture.",
              "This is how luxury should smell: understated and confident."
            ].map((text, index) => (
              <div
                key={`review-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
              >
                {text}
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Product;
