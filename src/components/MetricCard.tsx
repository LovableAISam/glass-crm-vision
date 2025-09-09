import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "glass" | "glassPrimary" | "glassSecondary";
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  variant = "glass" 
}: MetricCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card variant={variant} className="p-6 group">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 smooth-transition">
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${changeColor[changeType]} flex items-center gap-1`}>
            <span>{change}</span>
            <span className="text-xs">vs last month</span>
          </p>
        </div>
        
        <div className="p-3 glass rounded-xl group-hover:scale-110 smooth-transition">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}