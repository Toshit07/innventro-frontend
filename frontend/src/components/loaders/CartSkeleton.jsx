import SkeletonBlock from "./SkeletonBlock";

const CartSkeleton = () => (
  <div className="flex flex-col gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`cart-skeleton-${index}`}
        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <SkeletonBlock className="h-16 w-16 rounded-2xl" />
        <div className="flex-1">
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="mt-2 h-3 w-1/3" />
        </div>
        <SkeletonBlock className="h-8 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export default CartSkeleton;
