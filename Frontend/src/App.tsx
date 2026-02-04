import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// === PAGES IMPORT ===
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import KenalAdministrasi from "./pages/KenalAdministrasi";
import TemplatePage from "./pages/TemplatePage";
import SOPRequest from "./pages/SOPRequest";
import FormRequest from "./pages/FormRequest";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// === NEW SOP PAGES IMPORT ===
import SOPPerizinan from "./pages/SOPPerizinan";
import SOPPeminjamanRuang from "./pages/SOPPeminjamanRuang";
import FormatProposal from "./pages/FormatProposal";
import FormatLPJ from "./pages/FormatLPJ";
import KetentuanPenulisan from "./pages/KetentuanPenulisan";

// ❌ KITA HAPUS INI KARENA SUDAH PINDAH KE TOKEN-BASED
// axios.defaults.withCredentials = true; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} /> {/* Jaga-jaga kalau user ketik /login */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/kenal-administrasi" element={<KenalAdministrasi />} />
          
          {/* === SOP & ADMINISTRASI ROUTES (NEW) === */}
          <Route path="/sop/perizinan" element={<SOPPerizinan />} />
          <Route path="/sop/peminjaman-ruang" element={<SOPPeminjamanRuang />} />
          <Route path="/sop/format-proposal" element={<FormatProposal />} />
          <Route path="/sop/format-lpj" element={<FormatLPJ />} />
          <Route path="/sop/ketentuan-penulisan" element={<KetentuanPenulisan />} />

          {/* Template & Request Routes */}
          <Route path="/template/:type" element={<TemplatePage />} />
          <Route path="/sop-request" element={<SOPRequest />} />
          <Route path="/form-request" element={<FormRequest />} />
          <Route path="/settings" element={<Settings />} />

          {/* Redirects & 404 */}
          <Route path="/index" element={<Navigate to="/dashboard" replace />} />
          <Route path="/sop-perizinan" element={<Navigate to="/sop/perizinan" replace />} /> {/* Redirect link lama */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;