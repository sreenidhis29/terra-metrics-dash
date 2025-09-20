import { Bell, ChevronDown, Settings, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import agriLogo from "@/assets/agri-ai-logo.png";

const DashboardHeader = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="public\favicon.ico" className="w-full h-full object-cover"/>
          </div>

            <span className="text-xl font-semibold">KRUSHI</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="north-farm-plot-a">
          <SelectTrigger className="w-48 bg-secondary">
            <SelectValue placeholder="Select Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="north-farm-plot-a">📍 North Farm - Plot A</SelectItem>
            <SelectItem value="south-field">📍 South Field (32.1 ha)</SelectItem>
            <SelectItem value="east-field">📍 East Field (56.8 ha)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="hidden md:block">John Doe</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;