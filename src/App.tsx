import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Avaliacao from "./pages/Avaliacao";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import Registar from "./pages/Registar";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Medicos from "./pages/Medicos";
import Humor from "./pages/Humor";
import Admin from "./pages/Admin";
import AdminAccess from "./pages/AdminAccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registar" element={<Registar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/humor/:mood" element={<Humor />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/area-restrita" element={<AdminAccess />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
