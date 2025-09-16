import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  service?: "m365" | "proofpoint" | "duo" | "s1";
  style?: CSSProperties;
}

export function GlassCard({ children, className, service, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 fade-in hover-glow transition-all duration-300",
        service && `service-${service}`,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}