import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target } from "lucide-react";

const pipelineStages = [
  { name: "Leads", count: 124, value: "$45,200", color: "bg-accent" },
  { name: "Qualified", count: 67, value: "$89,400", color: "bg-primary" },
  { name: "Proposal", count: 23, value: "$156,800", color: "bg-warning" },
  { name: "Negotiation", count: 12, value: "$78,900", color: "bg-success" },
  { name: "Closed Won", count: 8, value: "$234,500", color: "bg-success" }
];

export function SalesPipeline() {
  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Sales Pipeline</h3>
        <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>Goal: $500K</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {pipelineStages.map((stage, index) => (
          <div key={stage.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color} animate-pulse-glow`} />
                <span className="text-sm font-medium">{stage.name}</span>
                <span className="text-xs text-muted-foreground">({stage.count})</span>
              </div>
              <span className="text-sm font-semibold">{stage.value}</span>
            </div>
            
            <div className="glass rounded-lg p-1">
              <Progress 
                value={(stage.count / 124) * 100} 
                className="h-2 group-hover:h-3 smooth-transition"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Pipeline Value</span>
          <span className="text-lg font-bold text-primary">$604,800</span>
        </div>
      </div>
    </Card>
  );
}