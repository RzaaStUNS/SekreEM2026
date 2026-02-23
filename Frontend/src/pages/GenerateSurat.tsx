import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, ListChecks, Info, Calendar as CalendarIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

// === KONSTANTA & OPSI ===
const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const BIDANG_OPTIONS = [
  { value: "K", label: "Ketua Umum (K)" },
  { value: "WK", label: "Wakil Ketua Umum (WK)" },
  { value: "SB", label: "Sekretaris Bendahara (SB)" },
  { value: "PO", label: "Pengembangan Organisasi (PO)" },
  { value: "JN", label: "Jaringan (JN)" },
  { value: "LB", label: "Litbang (LB)" },
  { value: "M", label: "Kemahasiswaan (M)" },
  { value: "U", label: "Uki (U)" },
];

const SIFAT_OPTIONS = [
  { value: "01", label: "Internal (01)" },
  { value: "02", label: "Eksternal (02)" },
];

export default function GenerateSurat() {
  // === STATE FORM ===
  const [perihal, setPerihal] = useState("");
  const [bidang, setBidang] = useState("SB");
  const [sifat, setSifat] = useState("01");
  const [tujuanBulk, setTujuanBulk] = useState("");

  // === DATA BACKGROUND (Auto-Generated) ===
  const startNoUrut = 22; // Mock: Nanti bisa di-fetch dari API (Nomor terakhir + 1)
  const pj = "Abimanyu";
  
  const today = new Date();
  const year = today.getFullYear();
  const monthRoman = ROMAN_MONTHS[today.getMonth()];
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${year}`;

  // === CORE LOGIC: REAL-TIME GENERATION ===
  const generatedLetters = useMemo(() => {
    // Pisahkan berdasarkan Enter, hilangkan baris kosong
    const destinations = tujuanBulk.split('\n').filter(line => line.trim() !== '');

    return destinations.map((tujuan, index) => {
      const currentUrut = startNoUrut + index;
      const paddedUrut = String(currentUrut).padStart(3, '0'); // Format 3 digit (e.g., 022)
      
      // Format: [No.Urut]/UNS27.21/V21.[Bidang][Sifat].[BulanRomawi]/[Tahun]
      const noSurat = `${paddedUrut}/UNS27.21/V21.${bidang}${sifat}.${monthRoman}/${year}`;

      return {
        id: currentUrut,
        noSurat,
        tujuan: tujuan.trim(),
        perihal,
        bidang,
        sifat,
        pj,
        tanggal: dateStr
      };
    });
  }, [tujuanBulk, perihal, bidang, sifat, monthRoman, year, dateStr]);

  // === HANDLER SIMPAN ===
  const handleSimpan = () => {
    if (generatedLetters.length === 0) {
        alert("Isi tujuan surat terlebih dahulu!");
        return;
    }
    if (!perihal) {
        alert("Perihal surat tidak boleh kosong!");
        return;
    }

    console.log("🚀 DATA SURAT SIAP DIKIRIM KE API:", generatedLetters);
    alert(`Berhasil men-generate ${generatedLetters.length} nomor surat!\n\n(Silakan cek Console Log untuk melihat JSON Data-nya)`);
    
    // Nanti di sini tinggal tambahin: await axios.post('/api/surat/bulk', generatedLetters)
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden animate-fade-in pr-2 pb-2">
        
        {/* === KOLOM KIRI: FORM INPUT === */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col h-full space-y-4">
          
          <div className="card-pastel p-5 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-5 flex items-center gap-2">
              <FileText size={22} className="text-pink-500" /> Form Surat Keluar
            </h2>

            <div className="space-y-4 flex-1">
              {/* Input Perihal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Perihal / Isi Surat</label>
                <Input 
                    value={perihal} 
                    onChange={(e) => setPerihal(e.target.value)} 
                    className="h-12 bg-white/60 border-pink-100 focus:bg-white focus:ring-2 focus:ring-pink-200 rounded-xl font-medium shadow-sm transition-all" 
                    placeholder="Contoh: Undangan Rapat Pleno"
                />
              </div>

              {/* Grid Bidang & Sifat */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bidang</label>
                  <Select value={bidang} onValueChange={setBidang}>
                      <SelectTrigger className="h-12 bg-white/60 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 shadow-sm">
                          <SelectValue placeholder="Pilih Bidang" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-pink-100 shadow-xl">
                          {BIDANG_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="rounded-lg my-0.5 cursor-pointer">{opt.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sifat</label>
                  <Select value={sifat} onValueChange={setSifat}>
                      <SelectTrigger className="h-12 bg-white/60 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 shadow-sm">
                          <SelectValue placeholder="Pilih Sifat" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-pink-100 shadow-xl">
                          {SIFAT_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="rounded-lg my-0.5 cursor-pointer">{opt.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Textarea Bulk Tujuan */}
              <div className="space-y-1.5 flex flex-col flex-1 min-h-[250px]">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tujuan Surat (Bulk)</label>
                    <span className="text-[10px] text-pink-500 font-medium bg-pink-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Info size={10} /> 1 Baris = 1 Surat
                    </span>
                </div>
                <Textarea 
                    value={tujuanBulk} 
                    onChange={(e) => setTujuanBulk(e.target.value)} 
                    className="flex-1 bg-white/60 border-pink-100 focus:bg-white focus:ring-2 focus:ring-pink-200 rounded-xl resize-none shadow-sm font-medium leading-relaxed p-4" 
                    placeholder="Ketua BEM UNS&#10;Gubernur BEM SV&#10;Wakil Dekan SV"
                />
              </div>
            </div>

            {/* Info Background Data */}
            <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 text-xs text-gray-600 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5"><CalendarIcon size={12} className="text-pink-500"/> {dateStr} (Bulan {monthRoman})</div>
                <div className="flex items-center gap-1.5"><User size={12} className="text-purple-500"/> PJ: {pj}</div>
                <div className="flex items-center gap-1.5 col-span-2"><ListChecks size={12} className="text-baby-blue"/> Dimulai dari No Urut: <span className="font-bold text-gray-800">{String(startNoUrut).padStart(3, '0')}</span></div>
            </div>
          </div>
        </div>

        {/* === KOLOM KANAN: PREVIEW === */}
        <div className="flex-1 flex flex-col h-full space-y-4">
            
          <div className="card-pastel p-6 flex flex-col h-full shadow-lg border-white/50 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Preview Surat Terbuat 
                    <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full font-bold">
                        {generatedLetters.length} Surat
                    </span>
                </h2>
                
                <Button 
                    onClick={handleSimpan} 
                    disabled={generatedLetters.length === 0 || !perihal}
                    className="h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-transform active:scale-95 px-6"
                >
                    <Save size={16} className="mr-2" /> Simpan {generatedLetters.length > 0 ? generatedLetters.length : ''} Surat
                </Button>
            </div>

            {/* Area Tabel Preview */}
            <div className="flex-1 overflow-y-auto bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm scrollbar-thin scrollbar-thumb-pink-200 relative z-10">
                {generatedLetters.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                        <FileText size={48} className="text-pink-200 mb-3" />
                        <p className="font-medium text-gray-500">Belum ada surat yang di-generate.</p>
                        <p className="text-sm mt-1">Ketikkan tujuan surat di form sebelah kiri (1 baris untuk 1 tujuan surat).</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-sm">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 w-16 text-center rounded-tl-2xl">No</th>
                                <th className="p-4 font-bold text-gray-500 w-64">Nomor Surat</th>
                                <th className="p-4 font-bold text-gray-500">Tujuan</th>
                                <th className="p-4 font-bold text-gray-500 rounded-tr-2xl">Perihal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedLetters.map((surat, i) => (
                                <tr key={surat.id} className="border-b border-pink-50/50 hover:bg-pink-50/30 transition-colors group">
                                    <td className="p-4 text-center font-medium text-gray-500">{i + 1}</td>
                                    <td className="p-4 font-mono font-semibold text-pink-600 text-xs">{surat.noSurat}</td>
                                    <td className="p-4 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{surat.tujuan}</td>
                                    <td className="p-4 text-gray-500 truncate max-w-[150px]" title={surat.perihal}>{surat.perihal || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
