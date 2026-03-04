import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2
        className={cn("animate-spin text-muted-foreground", className, size)}
      />
    </div>
  );
}
