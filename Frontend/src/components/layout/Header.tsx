import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [userName, setUserName] = useState("Sekretaris");
  const [userInitials, setUserInitials] = useState("S");
  const [userImg, setUserImg] = useState("");
  
  const navigate = useNavigate();

  // === FUNGSI MAPPING LOGO (Tetap) ===
  const getLogoByEmail = (email: string) => {
    if (email.includes("ketum")) return "/logo-ketuaumum.png";
    if (email.includes("waketum")) return "/logo-waketum.png";
    if (email.includes("sekum")) return "/logo-sekum.png";
    if (email.includes("bendum")) return "/logo-bendum.png";
    if (email.includes("personalia")) return "/logo-personalia.png";
    if (email.includes("ekraf")) return "/logo-ekraf.png";
    if (email.includes("psdm")) return "/logo-psdm.png";
    if (email.includes("mikat")) return "/logo-mikat.png";
    if (email.includes("humas")) return "/logo-humas.png";
    if (email.includes("sosma")) return "/logo-sosma.png";
    if (email.includes("medinfo")) return "/logo-medinfo.png";
    if (email.includes("rnd")) return "/logo-rnd.png";
    return "/placeholder.svg";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user) {
          setUserName(user.name);
          if (user.email) setUserImg(getLogoByEmail(user.email));
          if (user.name) {
            const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            setUserInitials(initials);
          }
        }
      } catch (error) {
        console.error("Gagal membaca data user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  return (
    <>
      {/* CSS KHUSUS UNTUK EFEK GLITCH BRUTAL (TETAP ADA) */}
      <style>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(15% 0 80% 0); transform: translate(-1px, -2px); }
          80% { clip-path: inset(55% 0 10% 0); transform: translate(1px, 2px); }
          100% { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 1px); }
        }
        @keyframes border-flash {
          0%, 100% { border-color: #3b82f6; box-shadow: 0 0 2px #3b82f6; }
          50% { border-color: #ec4899; box-shadow: 0 0 10px #ec4899; }
        }
        
        .glitch-wrapper::before,
        .glitch-wrapper::after {
          content: "";
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border: 2px solid;
          border-radius: 1.5rem;
          z-index: -1;
          pointer-events: none;
        }
        
        .glitch-wrapper::before {
          border-color: #ff00ff;
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          opacity: 0.5;
        }
        
        .glitch-wrapper::after {
          border-color: #00ffff;
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
          opacity: 0.5;
        }
      `}</style>

      <div className="sticky top-0 z-30 mx-4 mt-4">
        {/* WRAPPER GLITCH */}
        <div className="relative glitch-wrapper group rounded-3xl">
            
          {/* Main Border yang berkedip (Flash) */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent animate-[border-flash_3s_infinite] pointer-events-none"></div>

          {/* KONTEN HEADER - BACKGROUND KEMBALI KE ORIGINAL (bg-card) */}
          <header className="relative bg-card rounded-3xl flex items-center justify-between px-6 py-5 z-10 shadow-soft">
            
            <h1 className="relative text-xl md:text-2xl font-bold text-foreground truncate max-w-[200px] md:max-w-none tracking-tight">
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">{userName.split(" ")[0]}</span>
              <span className="inline-block animate-pulse ml-1">⚡</span>
            </h1>

            <div className="flex items-center gap-3 relative z-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 ring-2 ring-cyan-500/30 hover:ring-pink-500/50 transition-all p-0.5 cursor-pointer hover:scale-105 duration-150 bg-white">
                    <AvatarImage src={userImg} alt={userName} className="object-contain" />
                    {/* Fallback dikembalikan ke warna original */}
                    <AvatarFallback className="bg-lavender text-foreground font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                {/* Dropdown dikembalikan ke warna original */}
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white shadow-lg border border-border/50 text-foreground">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <div className="px-2 pb-2 text-xs text-muted-foreground truncate">
                    {userName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer rounded-xl hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};