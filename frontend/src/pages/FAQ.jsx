import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";

const FAQ = ({ direction }) => (
  <PageTransition direction={direction} className="lux-gradient">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
      <SectionTitle
        eyebrow="FAQ"
        title="Frequently asked"
        description="Everything you need to know about our fragrances and service."
      />

      <div className="grid gap-6">
        {
          [
            {
              question: "How does the sample kit work?",
              answer:
                "Choose 3-5 perfumes and we send fragrance-infused strips with QR reorders."
            },
            {
              question: "Do you offer returns?",
              answer:
                "Unused, sealed bottles can be returned within 14 days for a full refund."
            },
            {
              question: "What is the typical delivery time?",
              answer:
                "Standard deliveries arrive in 3-5 business days within the US."
            },
            {
              question: "Can I reorder from a sample strip?",
              answer:
                "Yes. Every strip includes a QR code that opens the product page instantly."
            }
          ].map((item) => (
            <div
              key={item.question}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70"
            >
              <h3 className="font-display text-2xl">{item.question}</h3>
              <p className="mt-4">{item.answer}</p>
            </div>
          ))
        }
      </div>
    </div>
  </PageTransition>
);

export default FAQ;
