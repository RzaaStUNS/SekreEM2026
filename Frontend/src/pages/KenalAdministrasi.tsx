import { MainLayout } from "@/components/layout/MainLayout";
import { 
  FileText, 
  Building2, 
  File, 
  FileDown, 
  PenTool, 
  ArrowRight,
  Presentation,
  ExternalLink // Saya tambah icon ini buat penanda link keluar
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Data Menu untuk diloop
const menuSOP = [
  {
    title: "Alur Perizinan Proposal",
    description: "Panduan lengkap pengajuan SIK dan Tanda Tangan.",
    icon: <FileText size={32} />,
    color: "bg-pink-pastel", // Pink
    textColor: "text-pink-pastel",
    path: "/sop/perizinan",
  },
  {
    title: "Alur Peminjaman Ruang",
    description: "Prosedur meminjam fasilitas dan ruangan di Sekolah Vokasi.",
    icon: <Building2 size={32} />,
    color: "bg-baby-blue", // Biru
    textColor: "text-baby-blue",
    path: "/sop/peminjaman-ruang",
  },
  {
    title: "Format Proposal",
    description: "Standarisasi kop, cover, dan isi proposal kegiatan.",
    icon: <File size={32} />,
    color: "bg-soft-peach", // Orange muda
    textColor: "text-orange-400",
    path: "/sop/format-proposal",
  },
  {
    title: "Format LPJ",
    description: "Ketentuan tenggat waktu dan materai untuk LPJ.",
    icon: <FileDown size={32} />,
    color: "bg-lavender", // Ungu
    textColor: "text-lavender-dark",
    path: "/sop/format-lpj",
  },
  {
    title: "Ketentuan Penulisan",
    description: "Aturan font, spasi, margin, dan penomoran surat.",
    icon: <PenTool size={32} />,
    color: "bg-green-100", // Hijau soft
    textColor: "text-green-600",
    path: "/sop/ketentuan-penulisan",
  },
];

export default function KenalAdministrasi() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in pb-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            <span className="bg-pink-pastel text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md">📋</span>
            Kenal Administrasi
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pusat informasi dan standar operasional prosedur (SOP) untuk kebutuhan administrasi Eksekutif Mahasiswa.
          </p>
        </div>

        {/* Grid Menu */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuSOP.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="group relative overflow-hidden rounded-[2rem] bg-white border border-border/40 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Icon Box */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                  item.color + "/20", // Background transparan
                  item.textColor
                )}>
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-pink-pastel transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {item.description}
                </p>

                <div className="flex items-center text-sm font-semibold text-pink-pastel">
                  Lihat Detail <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* Dekorasi Background Hover */}
              <div className={cn(
                "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                item.color
              )} />
            </Link>
          ))}

          {/* === Card Spesial: Link Canva === */}
          <div className="rounded-[2rem] bg-gradient-to-br from-[#5b21b6] to-[#4c1d95] text-white p-6 flex flex-col justify-between shadow-soft relative overflow-hidden group">
            {/* Dekorasi Background ala Canva */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
            
            <div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-white backdrop-blur-sm shadow-inner border border-white/10">
                    <Presentation size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">Materi Presentasi</h3>
                <p className="text-sm text-gray-200/90 mb-6">
                    Akses slide "Kenal Administrasi" versi interaktif langsung di Canva.
                </p>
            </div>
            
            <a 
                href="https://www.canva.com/design/DAGd0CetuYQ/T2RAFJYpDD4mWIterH_dFw/view" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-white text-[#4c1d95] hover:bg-gray-100 transition-all font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
                Buka Slide Canva <ExternalLink size={18} />
            </a>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
