import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT GAMBAR MASKOT (Pastikan path ini benar)
import idleImg from "@/assets/mascot/idle.png";
import sleepImg from "@/assets/mascot/sleep.png";
import speakingImg from "@/assets/mascot/speaking.png";
import thinkingImg from "@/assets/mascot/thinking.png";

export default function Login() {
  // --- KONFIGURASI API BARU (TOKEN BASED) ---
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    // withCredentials: true,  <-- INI KITA HAPUS BIAR GA CONFLICT CSRF
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mascotState, setMascotState] = useState<
    "sleeping" | "idle" | "thinking" | "speaking"
  >("sleeping");

  const navigate = useNavigate();
  const { toast } = useToast();

  // useEffect untuk CSRF Cookie KITA HAPUS (Tidak perlu lagi)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMascotState("speaking");

    if (!email.endsWith("@em.uns.ac.id") && !email.endsWith("@uns.ac.id")) {
      toast({
        title: "Gunakan email resmi yaa 💌",
        description: "Silakan login dengan email @em.uns.ac.id",
        variant: "destructive",
      });
      setMascotState("sleeping");
      return;
    }

    setIsLoading(true);

    try {
      // Request Login ke Backend
      const response = await api.post("/api/login", { email, password });

      // --- LOGIKA BARU: SIMPAN TOKEN ---
      const token = response.data.access_token;
      const user = response.data.user;

      if (token) {
        // Simpan token di LocalStorage (Brankas Browser)
        localStorage.setItem("auth_token", token);
        // Simpan data user (opsional, buat tampil nama di dashboard)
        localStorage.setItem("user_data", JSON.stringify(user));

        toast({ title: "Login Berhasil! 🎉", description: `Selamat datang, ${user.name}!` });
        
        // Redirect ke Dashboard
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || "Gagal terhubung ke server";
      
      toast({
        title: "Gagal Masuk ❌",
        description: msg,
        variant: "destructive",
      });
      
      // Kembalikan maskot ke idle setelah error
      setTimeout(() => setMascotState("idle"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // === RENDER BORDER EFFECTS (TETAP SAMA) ===
  const renderMascotBorder = () => {
    switch (mascotState) {
      case "idle":
        return (
          <>
            <div className="absolute -inset-4 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -inset-1 rounded-full border border-dashed border-orange-300/60 animate-spin-slower"></div>
            <div className="absolute -inset-1 rounded-full border-2 border-orange-400 border-t-transparent border-l-transparent animate-spin-slow"></div>
          </>
        );
      case "thinking":
        return (
          <>
            <div className="absolute -inset-2 rounded-full border border-green-200/50"></div>
            <div className="absolute -inset-2 rounded-full border-[3px] border-transparent border-t-green-500 border-b-green-500 animate-spin-slow"></div>
            <div className="absolute -inset-0 rounded-full border-[3px] border-transparent border-l-green-400 border-r-green-400 animate-spin-reverse-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center animate-spin">
              <div className="w-full h-full animate-orbit">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              </div>
            </div>
          </>
        );
      case "speaking":
        return (
          <>
            <div className="absolute inset-0 rounded-full border-[2px] border-yellow-400 bg-yellow-100/30 animate-ripple-1"></div>
            <div className="absolute inset-0 rounded-full border-[2px] border-yellow-400 bg-yellow-100/30 animate-ripple-2"></div>
            <div className="absolute -inset-1 rounded-full border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
          </>
        );
      case "sleeping":
      default:
        return (
          <>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]"></div>
            <div className="absolute -inset-2 rounded-full border-[3px] animate-breathe-blue"></div>
          </>
        );
    }
  };

  const getMascotImg = () => {
    switch (mascotState) {
      case "idle": return idleImg;
      case "thinking": return thinkingImg;
      case "speaking": return speakingImg;
      case "sleeping": return sleepImg;
      default: return sleepImg;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4 relative overflow-hidden supports-[overflow:clip]:overflow-clip">
      {/* Animated pastel background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-pink-pastel rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-soft-peach rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slower animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-pastel/80 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slowest animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lavender/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob-slow"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-xl p-8 relative z-10 animate-scale-in border border-white/40">
        {/* Mascot */}
        <div className="flex justify-center mb-10 relative h-36 w-36 mx-auto">
          {renderMascotBorder()}
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg">
            <img
              src={getMascotImg()}
              alt="Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          {mascotState === "thinking" && (
            <div className="absolute -right-6 -top-2 bg-white border-2 border-green-100 p-2 rounded-tr-xl rounded-tl-xl rounded-br-xl shadow-sm animate-bounce text-xs font-bold text-green-600 z-20">
              Ngetik... ✍️
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-center text-foreground mb-1">
          Selamat Datang ✨
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Sistem Administrasi Sekretaris
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                mascotState === "thinking"
                  ? "text-green-400"
                  : "text-pink-pastel"
              }`}
              size={20}
            />
            <Input
              type="email"
              placeholder="nama@em.uns.ac.id"
              value={email}
              onFocus={() => setMascotState("idle")}
              onBlur={() => {
                if (!password && !email) setMascotState("sleeping");
              }}
              onChange={(e) => {
                setEmail(e.target.value);
                setMascotState("thinking");
              }}
              className="pl-12 h-14 bg-baby-blue/20 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-pink-pastel/50 transition-all duration-300"
              required
            />
          </div>

          <div className="relative group">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                mascotState === "thinking"
                  ? "text-green-400"
                  : "text-pink-pastel"
              }`}
              size={20}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onFocus={() => setMascotState("idle")}
              onBlur={() => {
                if (!password && !email) setMascotState("sleeping");
              }}
              onChange={(e) => {
                setPassword(e.target.value);
                setMascotState("thinking");
              }}
              className="pl-12 pr-12 h-14 bg-soft-peach/30 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-pink-pastel/50 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-pink-pastel transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 text-white font-semibold rounded-full shadow-button transition-all duration-300 hover:scale-[1.02] ${
              mascotState === "speaking"
                ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                : "bg-gradient-to-r from-baby-blue to-pink-pastel"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Masuk...
              </span>
            ) : (
              "Masuk"
            )}
          </Button>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-muted-foreground text-sm mb-2">
              Tidak bisa login?
            </p>
            <p className="text-center text-muted-foreground text-xs mb-4">
              Hubungi admin berikut 💬
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://wa.me/+6282133751840"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-whatsapp-pastel hover:bg-whatsapp text-green-800 hover:text-white rounded-full text-sm font-medium transition-all duration-200"
              >
                <MessageCircle size={18} /> Chat Abimanyu
              </a>
              <a
                href="https://wa.me/+6285720243561"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-whatsapp-pastel hover:bg-whatsapp text-green-800 hover:text-white rounded-full text-sm font-medium transition-all duration-200"
              >
                <MessageCircle size={18} /> Chat Aldifa
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}