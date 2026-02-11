const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold/80 ${className}`}
  >
    {children}
  </span>
);

export default Badge;
