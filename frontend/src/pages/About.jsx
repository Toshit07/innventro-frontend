import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";

const About = ({ direction }) => (
  <PageTransition direction={direction} className="lux-gradient">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
      <SectionTitle
        eyebrow="About"
        title="The Innoventure atelier"
        description="A modern perfume house that curates quiet luxury, discovery, and precision." 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="font-display text-2xl">Curated by hand</h3>
          <p className="mt-4">
            Every fragrance in our vault is selected for balance, restraint, and
            lasting presence. We test blends across skin profiles to ensure the
            signature stays consistent from top notes to dry down.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="font-display text-2xl">AI-assisted discovery</h3>
          <p className="mt-4">
            Our AI pairing engine refines recommendations with each sample kit,
            capturing nuanced preferences and simplifying repeat ordering.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-sm text-white/70">
        Innoventure blends couture retail with digital intimacy so your fragrance
        story feels personal, cinematic, and effortless to revisit.
      </div>
    </div>
  </PageTransition>
);

export default About;
