import { cn } from "../lib/variants";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/10",
        className,
      )}
    >
      <div
        className="
          absolute top-0 left-0
          h-full
          animate-shimmer
          bg-linear-to-r
          from-transparent via-white/50 to-transparent
          w-[200%]
        "
      />
    </div>
  );
}
