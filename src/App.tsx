import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Training from "./pages/Training";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { logVisit } from "@/integrations/supabase/logVisit";

const queryClient = new QueryClient();

function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    logVisit(location.pathname);
  }, [location.pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteLogger />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training" element={<Training />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
