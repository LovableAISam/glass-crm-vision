import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SalesPipeline } from "@/components/SalesPipeline";
import { CustomerInsights } from "@/components/CustomerInsights";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Phone,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import heroImage from "@/assets/crm-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mx-6 mt-6 mb-8">
        <img 
          src={heroImage} 
          alt="CRM Dashboard" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Liquid Glass CRM
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience the future of customer relationship management with our liquid glass interface.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <DashboardHeader />
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value="$234,500"
            change="+12.5%"
            changeType="positive"
            icon={DollarSign}
            variant="glassPrimary"
          />
          <MetricCard
            title="Active Customers"
            value="1,247"
            change="+8.2%"
            changeType="positive"
            icon={Users}
          />
          <MetricCard
            title="Conversion Rate"
            value="3.24%"
            change="+0.8%"
            changeType="positive"
            icon={TrendingUp}
          />
          <MetricCard
            title="Avg Deal Size"
            value="$15,640"
            change="-2.1%"
            changeType="negative"
            icon={Target}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <SalesPipeline />
            
            {/* Quick Actions */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="glassPrimary" className="p-4 text-center group cursor-pointer">
                  <Phone className="h-6 w-6 mx-auto mb-2 group-hover:animate-bounce" />
                  <p className="text-sm font-medium">New Call</p>
                </Card>
                <Card variant="glassSecondary" className="p-4 text-center group cursor-pointer">
                  <Users className="h-6 w-6 mx-auto mb-2 group-hover:animate-bounce" />
                  <p className="text-sm font-medium">Add Contact</p>
                </Card>
                <Card variant="glass" className="p-4 text-center group cursor-pointer">
                  <Calendar className="h-6 w-6 mx-auto mb-2 group-hover:animate-bounce" />
                  <p className="text-sm font-medium">Schedule</p>
                </Card>
                <Card variant="glass" className="p-4 text-center group cursor-pointer">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 group-hover:animate-bounce" />
                  <p className="text-sm font-medium">New Deal</p>
                </Card>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <ActivityFeed />
            <CustomerInsights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
