import { cn } from "../lib/variants";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white/25 rounded-3xl p-6 text-white shadow-2xl w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
