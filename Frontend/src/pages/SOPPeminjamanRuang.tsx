import { MainLayout } from "@/components/layout/MainLayout";
import { Building2, FileCheck, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Komponen Robot (Reused)
const Robot = ({ emotion = "happy" }: { emotion?: "happy" | "thinking" | "pointing" }) => (
  <div className="relative animate-robot-idle w-20 h-24">
      {/* Body */}
      <div className="absolute bottom-0 w-16 h-14 bg-gradient-to-b from-baby-blue to-blue-300 rounded-2xl left-1/2 -translate-x-1/2">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-soft-peach" />
          <div className="w-2 h-2 rounded-full bg-pink-pastel" />
        </div>
      </div>
      {/* Head */}
      <div className="absolute top-0 w-14 h-12 bg-gradient-to-b from-baby-blue to-blue-200 rounded-2xl left-1/2 -translate-x-1/2">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-pink-pastel rounded-full">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-soft-peach rounded-full animate-pulse" />
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="w-2.5 h-2.5 bg-foreground rounded-full"><div className="w-1 h-1 bg-white rounded-full mt-0.5 ml-0.5" /></div>
          <div className="w-2.5 h-2.5 bg-foreground rounded-full"><div className="w-1 h-1 bg-white rounded-full mt-0.5 ml-0.5" /></div>
        </div>
        <div className={cn("absolute bottom-2 left-1/2 -translate-x-1/2", emotion === "happy" && "w-4 h-2 border-b-2 border-foreground rounded-b-full")} />
      </div>
      <div className="absolute bottom-8 -left-2 w-3 h-6 bg-baby-blue rounded-full" />
      <div className="absolute bottom-8 -right-2 w-3 h-6 bg-baby-blue rounded-full" />
  </div>
);

const steps = [
  {
    number: 1,
    title: "Pastikan SIK Sudah Terbit",
    description: "Surat Izin Kegiatan (SIK) adalah syarat MUTLAK. Pastikan sudah terbit sebelum mengajukan ruangan.",
    icon: <FileCheck size={28} />,
    iconBg: "bg-baby-blue",
    robotPosition: "left",
  },
  {
    number: 2,
    title: "Ajukan Surat Peminjaman",
    description: "Buat surat ditujukan ke: Bagian Umum Sekolah Vokasi & Wakil Dekan III.",
    icon: <Send size={28} />,
    iconBg: "bg-pink-pastel",
    robotPosition: "right",
  },
  {
    number: 3,
    title: "Lampirkan Dokumen",
    description: "Surat harus ditandatangani Ketua Kegiatan & Ketua Ormawa, serta dilampiri SIK.",
    icon: <Building2 size={28} />,
    iconBg: "bg-lavender",
    robotPosition: "left",
  },
];

export default function SOPPeminjamanRuang() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in pb-10">
        
        {/* === TOMBOL BACK === */}
        <div className="mb-6">
          <Link to="/kenal-administrasi" className="inline-flex items-center gap-2 text-muted-foreground hover:text-pink-pastel transition-colors font-medium">
            <ArrowLeft size={20} /> Kembali ke Menu
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2 flex items-center justify-center gap-3">
            Alur Peminjaman Ruang 🏫
          </h1>
          <p className="text-muted-foreground">Prosedur peminjaman fasilitas di Sekolah Vokasi</p>
        </div>

        <div className="relative space-y-8">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-baby-blue via-pink-pastel to-lavender -translate-x-1/2 hidden md:block" />
          {steps.map((step, index) => (
            <div key={step.number} className={cn("flex items-center gap-6 animate-fade-in flex-col", step.robotPosition === "right" ? "md:flex-row-reverse" : "md:flex-row")} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex-shrink-0 hidden md:block"><Robot emotion="pointing" /></div>
              <div className="flex-1 max-w-md">
                <div className="card-pastel p-6 relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-baby-blue to-pink-pastel rounded-2xl flex items-center justify-center shadow-button text-white font-bold">{step.number}</div>
                  <div className="flex items-start gap-4 pt-2">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-foreground", step.iconBg + "/30")}>{step.icon}</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-20 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}