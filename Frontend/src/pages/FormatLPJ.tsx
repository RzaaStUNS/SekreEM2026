import { MainLayout } from "@/components/layout/MainLayout";
import { Clock, Stamp, FileCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function FormatLPJ() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in pb-10">
        
        {/* === TOMBOL BACK === */}
        <div className="mb-6">
          <Link 
            to="/kenal-administrasi" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-pink-pastel transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Kembali ke Menu
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2">Format LPJ</h1>
          <p className="text-muted-foreground">Ketentuan Laporan Pertanggungjawaban</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Deadline */}
            <div className="card-pastel p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-lavender/30 text-lavender-dark rounded-full flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <h3 className="font-bold text-lg">Deadline Pengumpulan</h3>
                <p className="text-sm text-muted-foreground">
                    Paling lambat <span className="font-bold text-destructive">H+2 Hari</span> setelah kegiatan selesai dilaksanakan.
                </p>
            </div>

            {/* Card 2: Materai */}
            <div className="card-pastel p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-pink-pastel/20 text-pink-pastel rounded-full flex items-center justify-center">
                    <Stamp size={32} />
                </div>
                <h3 className="font-bold text-lg">Surat Pernyataan</h3>
                <p className="text-sm text-muted-foreground">
                    Wajib diberi cap <strong>E-Mailkomp periode saat ini</strong> pada bagian tanda tangan Ketua Kegiatan.
                </p>
            </div>

            {/* Card 3: Kelengkapan */}
            <div className="card-pastel p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-baby-blue/20 text-baby-blue rounded-full flex items-center justify-center">
                    <FileCheck size={32} />
                </div>
                <h3 className="font-bold text-lg">Kelengkapan LPJ</h3>
                <p className="text-sm text-muted-foreground">
                    Pastikan nota dan bukti transaksi terlampir rapi dan sesuai dengan anggaran yang diajukan.
                </p>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
