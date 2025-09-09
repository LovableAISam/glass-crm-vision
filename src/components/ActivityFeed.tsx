import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Users, Phone } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "deal",
    title: "Deal closed with Acme Corp",
    description: "$25,000 software license",
    time: "2 hours ago",
    user: "Sarah Chen",
    userAvatar: "/placeholder.svg",
    icon: DollarSign,
    badge: "success"
  },
  {
    id: 2,
    type: "meeting",
    title: "Call scheduled with TechStart Inc",
    description: "Product demo for enterprise plan",
    time: "4 hours ago",
    user: "Mike Johnson",
    userAvatar: "/placeholder.svg",
    icon: Phone,
    badge: "primary"
  },
  {
    id: 3,
    type: "lead",
    title: "New lead from website",
    description: "Interested in premium features",
    time: "6 hours ago",
    user: "System",
    userAvatar: "/placeholder.svg",
    icon: Users,
    badge: "secondary"
  }
];

export function ActivityFeed() {
  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 group">
            <div className="flex-shrink-0">
              <div className="glass p-2 rounded-lg group-hover:scale-110 smooth-transition">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <Badge 
                  variant={activity.badge as any}
                  className="glass text-xs"
                >
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={activity.userAvatar} />
                  <AvatarFallback>{activity.user[0]}</AvatarFallback>
                </Avatar>
                <span>{activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}