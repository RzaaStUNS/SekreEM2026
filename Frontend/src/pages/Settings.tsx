import { MainLayout } from "@/components/layout/MainLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  MessageCircle,
} from "lucide-react"; // Bell & Shield dihapus
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// === DATA CONTACT PERSON ===
const admins = [
  { name: "Abimanyu", phone: "6282133751840", role: "Admin IT" },
  { name: "Aldifa",   phone: "6281234567890", role: "Sekretaris Umum" }, 
];

interface SettingItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const SettingItem = ({
  icon,
  iconBg,
  title,
  description,
  action,
  onClick,
  danger,
}: SettingItemProps) => (
  <div
    onClick={onClick}
    className={cn(
      "card-pastel p-5 flex items-center gap-4 transition-all",
      onClick && "cursor-pointer hover:shadow-card hover:scale-[1.01] active:scale-[0.99]",
      danger && "border border-destructive/20 bg-destructive/5 hover:bg-destructive/10"
    )}
  >
    <div
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12",
        iconBg
      )}
    >
      {icon}
    </div>
    <div className="flex-1">
      <h3
        className={cn(
          "font-semibold text-lg",
          danger ? "text-destructive" : "text-foreground"
        )}
      >
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {action}
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  /* logout */
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user_data"); // Bersihkan data user juga
    navigate("/login");
  };

  /* Logic Chat WA Dynamic */
  const handleContactAdmin = (adminName: string, adminPhone: string) => {
    // Ambil nama user yang sedang login
    const storedUser = localStorage.getItem("user_data");
    let userName = "Pengurus";
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            userName = parsed.name || "Pengurus";
        } catch {}
    }

    const msg = `Halo ${adminName}, aku ${userName} butuh bantuan tentang web sekre.`;
    window.open(
      `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-lavender/30 rounded-2xl flex items-center justify-center shadow-sm">
            <SettingsIcon size={24} className="text-lavender" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-2xl">Pengaturan</h1>
            <p className="text-muted-foreground text-sm">
              Pusat kendali aplikasi
            </p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Menu Notifikasi & Keamanan DIHAPUS sesuai request */}

          {/* Help - Munculin Popup */}
          <SettingItem
            icon={<HelpCircle size={22} className="text-pink-pastel" />}
            iconBg="bg-pink-pastel/30"
            title="Pusat Bantuan"
            description="Hubungi admin jika ada kendala sistem"
            onClick={() => setIsHelpOpen(true)}
          />

          {/* Logout */}
          <SettingItem
            icon={<LogOut size={22} className="text-destructive" />}
            iconBg="bg-destructive/10"
            title="Keluar"
            description="Akhiri sesi login Anda"
            onClick={handleLogout}
            danger
          />
        </div>
      </div>

      {/* POPUP PILIH CP (Contact Person) */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <HelpCircle className="text-pink-pastel" />
                    Butuh Bantuan?
                </DialogTitle>
                <DialogDescription>
                    Pilih admin yang ingin Anda hubungi via WhatsApp:
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
                {admins.map((admin, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleContactAdmin(admin.name, admin.phone)}
                        className="flex items-center justify-between w-full p-4 rounded-2xl border border-transparent bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] transition-all group active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <MessageCircle size={24} fill="white" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase opacity-70 tracking-wider">{admin.role}</p>
                                <p className="font-bold text-lg leading-tight">{admin.name}</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-white/60 px-3 py-1.5 rounded-lg shadow-sm">
                            Chat
                        </span>
                    </button>
                ))}
            </div>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}