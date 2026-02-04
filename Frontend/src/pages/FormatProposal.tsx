import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileImage, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// === HELPER KOMPONEN: SCREENSHOT PLACEHOLDER ===
const ScreenshotPlaceholder = ({ label, src, isPortrait = false }: { label: string; src?: string; isPortrait?: boolean }) => (
  <div className={cn(
    "border-2 border-dashed border-pink-pastel/50 rounded-xl bg-soft-peach/20 p-4 flex flex-col items-center justify-center text-center hover:bg-soft-peach/40 transition-colors",
    // LOGIKA DIPERBAIKI:
    // Jika isPortrait=true, pakai container ramping (max-w-sm) dan tinggi (min-h-[400px])
    // Jika isPortrait=false (default), pakai container melebar (w-full) dan tinggi standar (min-h-[200px])
    isPortrait ? "max-w-sm mx-auto aspect-[3/4] min-h-[400px]" : "min-h-[200px] w-full"
  )}>
    {src ? (
        <img 
            src={src} 
            alt={label} 
            className={cn(
                "rounded-lg shadow-sm object-contain",
                // Jika portrait, gambar boleh tinggi full container
                // Jika landscape, tinggi dibatasi biar nggak terlalu makan tempat
                isPortrait ? "w-full h-full max-h-none" : "max-h-[400px] w-auto mx-auto"
            )} 
        />
    ) : (
        <>
            <FileImage className="text-pink-pastel mb-2" size={isPortrait ? 60 : 40} />
            <p className="text-sm text-muted-foreground font-medium">Screenshot {label}</p>
            <p className="text-xs text-muted-foreground/60">(Simpan gambar di public/assets/sop/)</p>
        </>
    )}
  </div>
);

export default function FormatProposal() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in pb-10">
        
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

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2">Format Proposal 📑</h1>
          <p className="text-muted-foreground">Panduan visual penyusunan proposal kegiatan</p>
        </div>

        <div className="grid gap-8">
          {/* 1. KOP SURAT (Landscape) */}
          <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-baby-blue/20">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Badge className="bg-baby-blue hover:bg-baby-blue/80">1</Badge> Standarisasi Kop Surat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Selama satu periode kepengurusan, hanya terdapat <strong>satu template kop surat</strong> yang valid.
              </p>
              <ScreenshotPlaceholder label="Kop Surat" src="/assets/sop/kop-surat.png" /> 
            </CardContent>
          </Card>

          {/* 2. COVER PROPOSAL (Portrait / 3x4) */}
          <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-lavender/30">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Badge className="bg-lavender hover:bg-lavender/80 text-foreground">2</Badge> Cover Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                Format cover proposal standar organisasi (Ukuran A4).
              </p>
              <ScreenshotPlaceholder 
                label="Cover Proposal" 
                src="/assets/sop/cover-proposal.png" 
                isPortrait={true} // INI TETAP PORTRAIT
              />
            </CardContent>
          </Card>

          {/* 3. ISI PROPOSAL (Hanya Teks) */}
          <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-soft-peach">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Badge className="bg-orange-300 hover:bg-orange-400 text-white">3</Badge> Isi Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                    <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-pink-pastel mt-2 shrink-0"/> <span><strong>Nama Kegiatan:</strong> Berisi judul kegiatan dan tema acara.</span></li>
                    <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-pink-pastel mt-2 shrink-0"/> <span><strong>Latar Belakang:</strong> Berisi dasar/alasan perlunya kegiatan yang akan dilaksanakan.</span></li>
                    <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-pink-pastel mt-2 shrink-0"/> <span><strong>Rasional:</strong> Penjelasan mengenai bagaimana kegiatan ini dapat menyelesaikan permasalahan yang diuraikan dalam latar belakang.</span></li>
                    <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-pink-pastel mt-2 shrink-0"/> <span><strong>Tujuan & Sasaran:</strong> Berisi tujuan/maksud dan pihak yang menjadi tujuan pelaksanaan kegiatan.</span></li>
                    <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-pink-pastel mt-2 shrink-0"/> <span><strong>Luaran:</strong> Menjelaskan hasil yang akan diperoleh dari kegiatan yang diajukan.</span></li>
                </ul>
            </CardContent>
          </Card>

          {/* 4. LEMBAR PENGESAHAN (TTD) - KEMBALI KE LANDSCAPE BIAR PAS */}
          <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-pink-pastel/20">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Badge className="bg-pink-pastel hover:bg-pink-pastel/80">4</Badge> Format Tanda Tangan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                <AlertCircle className="text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                    Lembar pengesahan ditempatkan <strong>setelah cover</strong> dan hanya memuat tanda tangan: 
                    <strong> Ketua Panitia (Ketupat), Ketua Umum (Ketum), dan Pembina.</strong>
                </p>
              </div>
              
              {/* SAYA HAPUS isPortrait={true} DISINI BIAR JADI LANDSCAPE */}
              <ScreenshotPlaceholder 
                label="Lembar Pengesahan" 
                src="/assets/sop/lembar-pengesahan.png"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}