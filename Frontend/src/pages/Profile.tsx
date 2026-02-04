import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Shield, User, Lock, MessageCircle } from "lucide-react"; 
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [userImg, setUserImg] = useState("");

  // === KONFIGURASI CONTACT PERSON (CP) ===
  // Ganti nomor HP di sini (Gunakan format 628...)
  const admins = [
    { name: "Abimanyu", phone: "6282133751840" }, 
    { name: "Aldifa",   phone: "6281234567890" }, // Ganti dengan nomor CP 2
  ];

  // === FUNGSI GENERATE LINK WA ===
  const handleContactAdmin = (adminName: string, adminPhone: string) => {
    if (!user) return;
    
    // Format Pesan: "Halo [Nama Admin], aku [Nama User] ingin mengganti password..."
    const message = `Halo ${adminName}, aku ${user.name} ingin mengganti password atau data login web sekre`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    
    // Buka di tab baru
    window.open(waLink, "_blank");
  };

  // === FUNGSI MAPPING LOGO ===
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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.email) {
          setUserImg(getLogoByEmail(parsedUser.email));
        }
      } catch (e) {
        console.error("Gagal parse user data", e);
      }
    }
  }, []);

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-pink-pastel/30 border-t-pink-pastel rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Memuat profil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
        
        {/* Header Profile Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-baby-blue via-lavender to-pink-pastel p-8 md:p-12 text-white shadow-soft group">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0"></div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm"></div>
                    <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/80 shadow-xl bg-white p-2">
                        <AvatarImage src={userImg} className="object-contain" />
                        <AvatarFallback className="bg-white text-pink-pastel text-4xl md:text-5xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute bottom-2 right-2 bg-green-400 hover:bg-green-500 border-2 border-white px-3 py-1">
                        Active
                    </Badge>
                </div>
                
                <div className="text-center md:text-left space-y-2 flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">
                        {user.name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/90 font-medium">
                        <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">
                            <Mail size={14} /> {user.email}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">
                            <Shield size={14} /> Administrator
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {/* KARTU KIRI: INFORMASI AKUN */}
            <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <User className="text-pink-pastel" /> Informasi Akun
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-bold ml-1">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input 
                                defaultValue={user.name} 
                                className="pl-9 h-12 rounded-xl bg-muted/20 border-transparent focus:bg-white transition-all" 
                                readOnly 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-bold ml-1">Email Resmi</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input 
                                defaultValue={user.email} 
                                className="pl-9 h-12 rounded-xl bg-muted/20 border-transparent focus:bg-white transition-all" 
                                readOnly 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KARTU KANAN: KEAMANAN (Direct WA) */}
            <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden flex flex-col">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Shield className="text-baby-blue" /> Keamanan & Akses
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    
                    <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-100">
                        <Lock size={32} />
                    </div>

                    <h3 className="font-bold text-foreground text-lg">Ingin Ganti Password?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                        Silakan hubungi Admin untuk melakukan reset password atau perubahan data login.
                    </p>

                    {/* LIST ADMIN CP */}
                    <div className="w-full grid gap-3 mt-2">
                        {admins.map((admin, index) => (
                            <button
                                key={index}
                                onClick={() => handleContactAdmin(admin.name, admin.phone)}
                                className="flex items-center justify-between w-full p-3 rounded-xl border border-transparent bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] transition-all group/btn"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-md group-hover/btn:scale-110 transition-transform">
                                        <MessageCircle size={20} fill="white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold uppercase opacity-70">Hubungi</p>
                                        <p className="font-bold text-sm">{admin.name}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded-md">
                                    Chat WA
                                </span>
                            </button>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}