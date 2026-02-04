import { MainLayout } from "@/components/layout/MainLayout";
import { Type, File, Hash, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function KetentuanPenulisan() {
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

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2">
            Ketentuan Penulisan & Penomoran ✍️
          </h1>
          <p className="text-muted-foreground">Standar teknis dokumen administrasi EM 2025</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Tipografi */}
          <div className="card-pastel p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-soft-peach rounded-full flex items-center justify-center text-foreground">
                <Type size={20} />
              </div>
              <h3 className="font-bold text-lg">Tipografi</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Jenis Font</span>
                <span className="font-semibold text-foreground">Times New Roman</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Ukuran Font</span>
                <span className="font-semibold text-foreground">12 pt</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Spasi (Spacing)</span>
                <span className="font-semibold text-foreground">1.5</span>
              </li>
            </ul>
          </div>

          {/* Tata Letak */}
          <div className="card-pastel p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-baby-blue rounded-full flex items-center justify-center text-foreground">
                <File size={20} />
              </div>
              <h3 className="font-bold text-lg">Tata Letak (Page Setup)</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Ukuran Kertas</span>
                <span className="font-semibold text-foreground">A4</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Margin (Atas - Bawah)</span>
                <span className="font-semibold text-foreground">2 cm - 2 cm</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Margin (Kiri - Kanan)</span>
                <span className="font-semibold text-foreground">2 cm - 2 cm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SECTION PENOMORAN SURAT */}
        <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Hash className="text-pink-pastel" /> Rumus Penomoran Surat
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="bg-foreground text-background p-4 rounded-xl font-mono text-center text-sm md:text-base mb-8 shadow-inner overflow-x-auto">
                    [No.Urut]/UNS27.21/V21.[Bidang][Jenis].[Bulan]/2025
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Keterangan Variabel</h4>
                        <ul className="space-y-2 text-sm">
                            <li><strong className="text-pink-pastel">No. Urut:</strong> Dimulai dari 001 dst.</li>
                            <li><strong className="text-pink-pastel">Kode SV:</strong> UNS27.21 (Tetap)</li>
                            <li><strong className="text-pink-pastel">Kode EM:</strong> V21 (Tetap Periode ini)</li>
                            <li><strong className="text-pink-pastel">Jenis Surat:</strong> 01 (Internal) / 02 (Eksternal)</li>
                            <li><strong className="text-pink-pastel">Bulan:</strong> Angka Romawi (I - XII)</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Kode Bidang</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-white p-2 rounded border border-border/50"><strong>K</strong> : Ketua Umum</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>WK</strong> : Wakil Ketum</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>SB</strong> : Sekbend</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>PO</strong> : Peng. Organisasi</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>JN</strong> : Jaringan</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>LB</strong> : Litbang</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>MW</strong> : Kemahasiswaan</div>
                            <div className="bg-white p-2 rounded border border-border/50"><strong>UU</strong> : Umum</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground mb-1">Contoh Penggunaan:</p>
                    <p className="font-bold text-lg text-foreground">001/UNS27.21/V21.K01.II/2025</p>
                </div>
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}