import SkeletonBlock from "./SkeletonBlock";

const ProductDetailSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <SkeletonBlock className="h-[420px] w-full rounded-3xl" />
    <div className="flex flex-col gap-4">
      <SkeletonBlock className="h-6 w-2/3" />
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-20 w-full rounded-2xl" />
      <SkeletonBlock className="h-12 w-full rounded-full" />
      <SkeletonBlock className="h-12 w-full rounded-full" />
    </div>
  </div>
);

export default ProductDetailSkeleton;
