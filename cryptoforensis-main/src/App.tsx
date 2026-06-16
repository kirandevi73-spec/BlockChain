import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./components/auth/AuthContext";
import { MetaMaskProvider } from "./hooks/useMetaMask";
import Index from "./pages/Index";
import Login from "./pages/Login";
import WalletVisualization from "./pages/WalletVisualization";
import RiskScoring from "./pages/RiskScoring";
import GraphExplorer from "./pages/GraphExplorer";
import MLAnalysis from "./pages/MLAnalysis";
import DarkWebLinks from "./pages/DarkWebLinks";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { api } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Clear backend analysis results on app start
    api.clearResult().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MetaMaskProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/wallets" element={<ProtectedRoute><WalletVisualization /></ProtectedRoute>} />
              <Route path="/risk" element={<ProtectedRoute><RiskScoring /></ProtectedRoute>} />
              <Route path="/explorer" element={<ProtectedRoute><GraphExplorer /></ProtectedRoute>} />
              <Route path="/ml-analysis" element={<ProtectedRoute><MLAnalysis /></ProtectedRoute>} />
              <Route path="/dark-web" element={<ProtectedRoute><DarkWebLinks /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          </MetaMaskProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
