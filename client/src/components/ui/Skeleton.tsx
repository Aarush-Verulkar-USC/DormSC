export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-line overflow-hidden">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-3 w-1/2 mb-5" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
