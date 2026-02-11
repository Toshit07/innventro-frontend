const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = ""
}) => {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="text-[11px] uppercase tracking-[0.4em] text-gold/70">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-2xl text-sm text-white/70">{description}</p>
      )}
    </div>
  );
};

export default SectionTitle;
