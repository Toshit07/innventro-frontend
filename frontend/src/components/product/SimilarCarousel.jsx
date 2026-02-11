import Button from "../ui/Button";

const SimilarCarousel = ({ items, onAdd }) => (
  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-lux">
    {items.map((perfume) => (
      <div
        key={`similar-${perfume.id}`}
        className="min-w-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      >
        <img
          src={perfume.images[0]}
          alt={perfume.name}
          className="h-40 w-full object-cover"
        />
        <div className="flex flex-col gap-2 p-4">
          <p className="font-display text-lg">{perfume.name}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            {perfume.brand}
          </p>
          <Button className="text-xs" onClick={(event) => onAdd(perfume, event)}>
            Add to Cart
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export default SimilarCarousel;
