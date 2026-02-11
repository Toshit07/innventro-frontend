import SkeletonBlock from "./SkeletonBlock";

const ReviewSkeleton = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`review-skeleton-${index}`}
        className="rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <SkeletonBlock className="h-3 w-1/4" />
        <SkeletonBlock className="mt-3 h-4 w-full" />
        <SkeletonBlock className="mt-2 h-4 w-5/6" />
      </div>
    ))}
  </div>
);

export default ReviewSkeleton;
