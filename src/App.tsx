import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FoodProvider } from "@/context/FoodContext";
import Landing from "./pages/Landing";
import ProviderDashboard from "./pages/ProviderDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FoodProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/ngo" element={<NgoDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FoodProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
