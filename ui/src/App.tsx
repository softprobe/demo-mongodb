import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Asynchronously load SDK to optimize first-screen performance
const initializeAnalytics = async () => {
  try {
    const { default: initSoftprobe } = await import('@softprobe/softprobe-web-record-sdk');
    initSoftprobe({
      appId: 'appId-softprobe-demo-page', // Replace with your application ID
      tenantId: 'tenant-softprobe-test-user',         // Replace with your tenant ID
      tags: { 
        userRole: 'guest',                 // Custom tags (optional, for categorical search)
      },
      privacy: {
        maskSelectors: ['.credit-card', '#password'] // DOM elements to mask
      }
    });
  } catch (error) {
    console.error('Softprobe initialization failed:', error);
  }
};
 
initializeAnalytics();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
