import { Button } from "@/components/ui/button";
import { Bell, Search, Settings, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="glass-card rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CRM Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers, deals..."
              className="glass-card pl-10 pr-4 py-2 w-64 text-sm border-0 focus:ring-2 focus:ring-primary/50 rounded-lg"
            />
          </div>
          
          <Button variant="glass" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="glass" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="glassPrimary" size="sm">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}