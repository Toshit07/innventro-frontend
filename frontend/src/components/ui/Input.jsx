const Input = ({ label, className = "", ...props }) => (
  <label className="flex w-full flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
    {label && <span>{label}</span>}
    <input
      className={`rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-pearl outline-none transition-none focus:border-gold/60 focus:bg-white/10 focus:shadow-[0_0_0_2px_rgba(200,169,81,0.25)] ${className}`}
      {...props}
    />
  </label>
);

export default Input;
