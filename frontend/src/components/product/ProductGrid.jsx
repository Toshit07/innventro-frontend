import ProductCard from "./ProductCard";

const ProductGrid = ({ items, onAdd }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {items.map((perfume) => (
      <ProductCard key={perfume.id} perfume={perfume} onAdd={onAdd} />
    ))}
  </div>
);

export default ProductGrid;
