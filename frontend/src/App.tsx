import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/contexts/LocationContext";
import Index from "./pages/Index";
import Fields from "./pages/Fields";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardHeader from "./components/DashboardHeader";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background dark">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/fields" element={<Fields />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </LocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;