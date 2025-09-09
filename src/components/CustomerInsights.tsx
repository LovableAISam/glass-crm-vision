import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, MessageCircle, Phone } from "lucide-react";

const topCustomers = [
  {
    id: 1,
    name: "Acme Corporation",
    avatar: "/placeholder.svg",
    value: "$45,200",
    deals: 8,
    status: "Premium",
    satisfaction: 4.8
  },
  {
    id: 2,
    name: "TechStart Inc",
    avatar: "/placeholder.svg", 
    value: "$32,800",
    deals: 5,
    status: "Active",
    satisfaction: 4.6
  },
  {
    id: 3,
    name: "Global Dynamics",
    avatar: "/placeholder.svg",
    value: "$28,500",
    deals: 3,
    status: "New",
    satisfaction: 4.9
  }
];

export function CustomerInsights() {
  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Top Customers</h3>
      </div>
      
      <div className="space-y-4">
        {topCustomers.map((customer, index) => (
          <div key={customer.id} className="glass-card rounded-lg p-4 group glass-hover">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold truncate">{customer.name}</h4>
                  <Badge 
                    variant={customer.status === 'Premium' ? 'default' : 'secondary'}
                    className="glass text-xs"
                  >
                    {customer.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-medium text-primary">{customer.value}</span>
                  <span>{customer.deals} deals</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span>{customer.satisfaction}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button variant="glass" size="sm" className="h-8 w-8 p-0">
                  <MessageCircle className="h-3 w-3" />
                </Button>
                <Button variant="glass" size="sm" className="h-8 w-8 p-0">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}