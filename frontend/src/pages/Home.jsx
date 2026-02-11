import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import ProductGrid from "../components/product/ProductGrid";
import { staggerContainer, staggerItem } from "../animations/motionVariants";

const quizQuestions = [
  {
    id: "family",
    label: "Fragrance Family",
    options: ["Woody", "Floral", "Oriental", "Fresh"]
  },
  {
    id: "occasion",
    label: "Occasion",
    options: ["Daily", "Evening", "Luxury"]
  },
  {
    id: "intensity",
    label: "Intensity",
    options: ["Soft", "Balanced", "Bold"]
  }
];

const intensityFilter = (perfume, intensity) => {
  if (!intensity) return true;
  if (intensity === "Soft") return perfume.performance.projection <= 62;
  if (intensity === "Balanced") return perfume.performance.projection <= 75;
  return perfume.performance.projection > 70;
};

const Home = ({ direction, perfumes, onAdd, sampleHistory }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleAnswer = (value) => {
    const key = quizQuestions[step].id;
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    }
  };

  const recommendations = useMemo(() => {
    return perfumes
      .filter((perfume) =>
        answers.family ? perfume.family === answers.family : true
      )
      .filter((perfume) =>
        answers.occasion ? perfume.occasion === answers.occasion : true
      )
      .filter((perfume) => intensityFilter(perfume, answers.intensity))
      .slice(0, 3);
  }, [answers, perfumes]);

  const sampleBased = useMemo(() => {
    if (!sampleHistory.length) return [];
    const sampledFamilies = new Set(
      sampleHistory.map((item) => item.family)
    );
    return perfumes
      .filter((perfume) => sampledFamilies.has(perfume.family))
      .filter((perfume) => !sampleHistory.find((s) => s.id === perfume.id))
      .slice(0, 3);
  }, [perfumes, sampleHistory]);

  const handleScrollToQuiz = () => {
    document.getElementById("ai-finder")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-28">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
          >
            <motion.p
              className="text-xs uppercase tracking-[0.4em] text-gold/70"
              variants={staggerItem}
            >
              Luxury Perfume Studio
            </motion.p>
            <motion.h1
              className="font-display text-4xl leading-tight md:text-6xl"
              variants={staggerItem}
            >
              LAVIURE curates perfume like a private atelier.
            </motion.h1>
            <motion.p
              className="max-w-xl text-sm text-white/70 md:text-base"
              variants={staggerItem}
            >
              Discover signature scents, try with precision sample strips, and
              unlock AI-assisted recommendations designed for confident, calm
              luxury.
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={staggerItem}>
              <Button onClick={() => navigate("/shop")}>Shop the Collection</Button>
              <Button variant="ghost" onClick={handleScrollToQuiz}>
                Start the AI Finder
              </Button>
            </motion.div>
          </motion.div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  Try Before You Buy
                </p>
                <p className="mt-3 font-display text-2xl">
                  Sample Strip Kit
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Select 3-5 perfumes. We ship fragrance-infused strips with QR
                  codes for instant reorders.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  QR Smart Flow
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Scan any strip to open a mobile-optimized landing with
                  fragrance notes, story, and one-tap purchase.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  AI Signature
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Your preferences refine every recommendation, building a
                  private scent archive over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ai-finder" className="grid gap-10">
          <SectionTitle
            eyebrow="AI Perfume Finder"
            title="Answer three questions, receive three rare matches."
            description="Calm, confident guidance powered by your sensory preferences."
          />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                  Question {step + 1} / {quizQuestions.length}
                </p>
                <button
                  className="text-xs uppercase tracking-[0.3em] text-white/50"
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                  }}
                >
                  Reset
                </button>
              </div>
              <h3 className="mt-4 font-display text-2xl">
                {quizQuestions[step].label}
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {quizQuestions[step].options.map((option) => (
                  <Button
                    key={option}
                    variant={answers[quizQuestions[step].id] === option ? "primary" : "ghost"}
                    className="text-[11px]"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">
                AI Recommendations
              </p>
              <div className="mt-6 grid gap-4">
                {recommendations.length === 0 && (
                  <p className="text-sm text-white/60">
                    Complete the questions to reveal your matches.
                  </p>
                )}
                {recommendations.map((perfume) => (
                  <div
                    key={`rec-${perfume.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <img
                      src={perfume.images[0]}
                      alt={perfume.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-display text-lg">{perfume.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {perfume.brand}
                      </p>
                    </div>
                    <Button className="text-xs" onClick={(event) => onAdd(perfume, event)}>
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10">
          <SectionTitle
            eyebrow="Sample History"
            title="Your sample strip selections refine every recommendation."
            description="Exclusive matches appear once you have sampled a scent."
          />
          {sampleBased.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
              Add perfumes to your Sample Strip Kit to unlock tailored
              recommendations.
            </div>
          ) : (
            <ProductGrid items={sampleBased} onAdd={onAdd} />
          )}
        </section>

        <section className="grid gap-10">
          <SectionTitle
            eyebrow="Featured"
            title="Editor-curated signatures"
            description="A focused edit from the atelier."
          />
          <ProductGrid items={perfumes.slice(0, 3)} onAdd={onAdd} />
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
