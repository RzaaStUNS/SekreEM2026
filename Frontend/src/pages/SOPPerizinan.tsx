import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, Stamp, Upload, Bell, ArrowLeft, ClipboardList, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Komponen Robot Maskot
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
    title: "Penyusunan Dokumen",
    description: "Sekretaris kegiatan menyusun Proposal, SIK, dan Lampiran. Penamaan file: 'SIK-E-Mailkomp-Nama Kegiatan.pdf'.",
    icon: <FileText size={28} />,
    iconBg: "bg-soft-peach",
    robotPosition: "left",
  },
  {
    number: 2,
    title: "Tanda Tangan Internal",
    description: "Ajukan TTD secara berurutan: Ketua Panitia (Ketupat) -> Ketua Umum (Ketum) -> Pembina.",
    icon: <Stamp size={28} />,
    iconBg: "bg-pink-pastel",
    robotPosition: "right",
  },
  {
    number: 3,
    title: "Konfirmasi ke Layanan Mawa",
    description: "Konfirmasi ke Mawa SV bahwa SIK telah diajukan. Format: 'SIK-NIM Ketupat-Nama Ketupat'.",
    icon: <Bell size={28} />,
    iconBg: "bg-baby-blue",
    robotPosition: "left",
  },
  {
    number: 4,
    title: "Analisis Risiko Kegiatan",
    description: "Jika TTD lengkap, serahkan Proposal, SIK, TOR/RAB, & Memo ke Pembina untuk mengisi Analisis Risiko.",
    icon: <ClipboardList size={28} />,
    iconBg: "bg-lavender",
    robotPosition: "right",
  },
  {
    number: 5,
    title: "Upload ke Website Yanma",
    description: (
      <span>
        Upload Proposal & SIK final ke{" "}
        <a href="https://yanma.vokasi.uns.ac.id/" target="_blank" rel="noopener noreferrer" className="text-pink-pastel underline hover:text-pink-600 font-bold">
          yanma.vokasi.uns.ac.id
        </a>
        {" "}dan isi formulir.
      </span>
    ),
    icon: <Upload size={28} />,
    iconBg: "bg-soft-peach",
    robotPosition: "left",
  },
];

export default function SOPPerizinan() {
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
            Alur Perizinan Proposal 📄
          </h1>
          <p className="text-muted-foreground">Prosedur pengajuan SIK dan Proposal Kegiatan</p>
        </div>

        {/* Steps Flow */}
        <div className="relative space-y-8 mb-16">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-baby-blue via-pink-pastel to-lavender -translate-x-1/2 hidden md:block" />
          {steps.map((step, index) => (
            <div key={step.number} className={cn("flex items-center gap-6 animate-fade-in flex-col", step.robotPosition === "right" ? "md:flex-row-reverse" : "md:flex-row")} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex-shrink-0 hidden md:block"><Robot emotion="happy" /></div>
              <div className="flex-1 max-w-md">
                <div className="card-pastel p-6 relative group hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-baby-blue to-pink-pastel rounded-2xl flex items-center justify-center shadow-button text-white font-bold group-hover:animate-bounce">{step.number}</div>
                  <div className="flex items-start gap-4 pt-2">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-foreground transition-colors", step.iconBg + "/30", "group-hover:" + step.iconBg + "/50")}>{step.icon}</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <div className="text-sm text-muted-foreground leading-relaxed">{step.description}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-20 hidden md:block" />
            </div>
          ))}
        </div>

        {/* Info Box Deadline */}
        <div className="grid md:grid-cols-2 gap-4">
            <div className="card-pastel p-6 flex items-start gap-4 border-l-4 border-l-orange-400">
                <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <CalendarClock size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-foreground">Batas Pengajuan SIK</h3>
                    <p className="text-sm text-muted-foreground">Maksimal <span className="text-orange-500 font-bold">H-10 Hari Kerja</span> sebelum pelaksanaan kegiatan.</p>
                </div>
            </div>
            <div className="card-pastel p-6 flex items-start gap-4 border-l-4 border-l-green-400">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CalendarClock size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-foreground">Batas Pengumpulan SPJ/LPJ</h3>
                    <p className="text-sm text-muted-foreground">Maksimal <span className="text-green-600 font-bold">H+14 Hari</span> setelah kegiatan selesai.</p>
                </div>
            </div>
        </div>

      </div>
    </MainLayout>
  );
}