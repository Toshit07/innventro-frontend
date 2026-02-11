import SkeletonBlock from "./SkeletonBlock";

const ProductGridSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`skeleton-card-${index}`}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <SkeletonBlock className="h-64 w-full rounded-2xl" />
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-4 w-2/3 rounded-full" />
          <SkeletonBlock className="h-4 w-12 rounded-full" />
        </div>
        <SkeletonBlock className="h-3 w-1/3 rounded-full" />
        <SkeletonBlock className="h-10 w-full rounded-full" />
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
