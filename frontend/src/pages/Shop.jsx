import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import ProductCard from "../components/product/ProductCard";
import ProductGridSkeleton from "../components/loaders/ProductGridSkeleton";
import { brands, fragranceFamilies, occasions } from "../data/perfumes";
import { staggerContainer, staggerItem } from "../animations/motionVariants";

const Shop = ({ direction, perfumes, onAdd }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    family: "All",
    occasion: "All"
  });

  const filtered = useMemo(() => {
    return perfumes.filter((perfume) => {
      const familyMatch =
        filters.family === "All" || perfume.family === filters.family;
      const occasionMatch =
        filters.occasion === "All" || perfume.occasion === filters.occasion;
      return familyMatch && occasionMatch;
    });
  }, [filters, perfumes]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handle = () => setIsDesktop(media.matches);
    handle();
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, []);

  const showFilters = filtersOpen || isDesktop;

  const FilterBlock = ({ label, options, valueKey }) => (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {["All", ...options].map((option) => (
          <button
            key={`${valueKey}-${option}`}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
              filters[valueKey] === option
                ? "border-gold/60 text-gold/80"
                : "border-white/10 text-white/60"
            }`}
            onClick={() =>
              setFilters((prev) => ({ ...prev, [valueKey]: option }))
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-28">
        <div className="flex items-center justify-between">
          <SectionTitle
            eyebrow="Shop"
            title="Curated perfume only."
            description="Filter by brand, fragrance family, and occasion."
          />
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            Filters
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <motion.aside
            className={`fixed inset-0 z-[60] bg-black/40 p-6 lg:static lg:z-auto lg:block lg:bg-transparent lg:p-0 ${
              showFilters ? "block" : "hidden"
            }`}
            initial={false}
            animate={{ opacity: showFilters ? 1 : 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDesktop) {
                setFiltersOpen(false);
              }
            }}
          >
            <motion.div
              className="h-full rounded-3xl border border-white/10 bg-ink p-6 lg:sticky lg:top-24 lg:h-auto"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: showFilters ? 0 : 30, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl">Filters</h3>
                <button
                  className="text-xs uppercase tracking-[0.3em] text-white/50 lg:hidden"
                  onClick={() => setFiltersOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-6">
                <FilterBlock
                  label="Family"
                  options={fragranceFamilies}
                  valueKey="family"
                />
                <FilterBlock
                  label="Occasion"
                  options={occasions}
                  valueKey="occasion"
                />
              </div>
            </motion.div>
          </motion.aside>

          <div>
            {loading ? (
              <ProductGridSkeleton />
            ) : (
              <motion.div
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {filtered.map((perfume) => (
                  <motion.div key={perfume.id} variants={staggerItem}>
                    <ProductCard perfume={perfume} onAdd={onAdd} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Shop;
