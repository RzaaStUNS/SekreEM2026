import { MainLayout } from "@/components/layout/MainLayout";
import { Globe, MousePointer, FileText, MessageCircle, UserCheck, FileCheck, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    title: "Membuka Web Sekretaris",
    description: "Akses halaman web Sekretaris untuk memulai proses request surat.",
    icon: <Globe size={24} />,
    iconBg: "bg-baby-blue",
  },
  {
    number: 2,
    title: "Memilih Menu Surat yang Diperlukan",
    description: "Pilih jenis surat yang ingin direquest sesuai kebutuhan.",
    icon: <MousePointer size={24} />,
    iconBg: "bg-soft-peach",
  },
  {
    number: 3,
    title: "Mengisi Google Form yang Tersedia",
    description: "Lengkapi form request dengan data yang diperlukan.",
    icon: <FileText size={24} />,
    iconBg: "bg-pink-pastel",
  },
  {
    number: 4,
    title: "Konfirmasi Request via Template Chat",
    description: "Konfirmasi request menggunakan template chat ke Contact Person.",
    icon: <MessageCircle size={24} />,
    iconBg: "bg-lavender",
  },
  {
    number: 5,
    title: "Contact Person Memproses Request",
    description: "Contact Person menyetujui dan memproses request surat.",
    icon: <UserCheck size={24} />,
    iconBg: "bg-baby-blue",
  },
  {
    number: 6,
    title: "Surat Selesai Dibuat",
    description: "Surat request selesai dibuat dan siap digunakan.",
    icon: <FileCheck size={24} />,
    iconBg: "bg-mikat",
  },
  {
    number: 7,
    title: "Meminta Tanda Tangan",
    description: "Minta tanda tangan dari pihak yang bersangkutan.",
    icon: <PenLine size={24} />,
    iconBg: "bg-pink-pastel",
  },
];

// Cute Robot
const Robot = () => (
  <div className="animate-robot-idle">
    <div className="w-16 h-20 relative">
      <div className="absolute bottom-0 w-12 h-10 bg-gradient-to-b from-pink-pastel to-pink-400 rounded-xl left-1/2 -translate-x-1/2">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      </div>
      <div className="absolute top-0 w-10 h-9 bg-gradient-to-b from-pink-pastel to-pink-300 rounded-xl left-1/2 -translate-x-1/2">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-soft-peach rounded-full">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-wakahim rounded-full animate-pulse" />
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-foreground rounded-full" />
          <div className="w-2 h-2 bg-foreground rounded-full" />
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-foreground/50 rounded-full" />
      </div>
      <div className="absolute bottom-6 -left-1 w-2 h-4 bg-pink-pastel rounded-full" />
      <div className="absolute bottom-6 -right-1 w-2 h-4 bg-pink-pastel rounded-full" />
    </div>
  </div>
);

export default function SOPRequest() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2 flex items-center justify-center gap-3">
            SOP Request Surat
            <span className="text-2xl">📮</span>
          </h1>
          <p className="text-muted-foreground">
            Panduan lengkap untuk melakukan request surat melalui Sekretaris
          </p>
        </div>

        {/* Template Chat Card */}
        <div className="card-pastel p-6 mb-10 border-l-4 border-baby-blue">
          <div className="flex items-start gap-3">
            <MessageCircle size={24} className="text-baby-blue flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Template Chat Konfirmasi</h3>
              <p className="text-muted-foreground italic bg-muted/50 p-3 rounded-xl text-sm">
                "Aku .... dari divisi .... mau meminta surat (perihal atau isi) untuk .... dan sudah mengisi gform."
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "flex items-start gap-6 animate-fade-in",
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Robot */}
              <div className="hidden md:flex items-center justify-center w-20 flex-shrink-0">
                <Robot />
              </div>

              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-baby-blue to-pink-pastel flex items-center justify-center shadow-button">
                  <span className="text-white font-bold">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 card-pastel p-5">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    step.iconBg + "/30"
                  )}>
                    <div className={step.iconBg.replace("bg-", "text-")}>
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden md:block w-20 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
