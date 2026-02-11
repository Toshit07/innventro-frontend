import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";

const Privacy = ({ direction }) => (
  <PageTransition direction={direction} className="lux-gradient">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
      <SectionTitle
        eyebrow="Privacy"
        title="Privacy policy"
        description="How we protect your personal information."
      />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <p>
          We collect only the information needed to fulfill orders, improve
          recommendations, and provide tailored service. Your payment data is
          processed securely through trusted providers and is never stored on
          our servers.
        </p>
      </div>
    </div>
  </PageTransition>
);

export default Privacy;
