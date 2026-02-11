import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";

const Terms = ({ direction }) => (
  <PageTransition direction={direction} className="lux-gradient">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
      <SectionTitle
        eyebrow="Terms"
        title="Terms of service"
        description="Guidelines for using the Innoventure platform."
      />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <p>
          By accessing Innoventure, you agree to use the platform responsibly and
          respect our intellectual property. Purchases are subject to availability
          and shipping restrictions. Full terms will be shared at checkout and
          in your confirmation email.
        </p>
      </div>
    </div>
  </PageTransition>
);

export default Terms;
