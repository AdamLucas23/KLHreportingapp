import { GlassCard } from "./GlassCard";

interface KPICardProps {
  title: string;
  metrics: Array<{
    label: string;
    value: string | number;
  }>;
  service?: "m365" | "proofpoint" | "duo" | "s1";
}

export function KPICard({ title, metrics, service }: KPICardProps) {
  return (
    <GlassCard service={service} className="h-full group hover:scale-105 transition-all duration-500">
      <h3 className="text-xl font-bold mb-6 text-gradient">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-glass-light/30 backdrop-blur-sm hover:bg-glass-light/50 transition-all duration-300 group-hover:scale-102" 
               style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">
              {metric.label}
            </div>
            <div className="text-2xl font-bold text-gradient">{metric.value}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}