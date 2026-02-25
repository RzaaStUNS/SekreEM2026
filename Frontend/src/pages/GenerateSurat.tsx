import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Info, RefreshCw, Layers, Calendar as CalendarIcon, User, PenTool, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

// === KONSTANTA KODE SURAT ===
const KODE_SV = "UNS27.21";
const KODE_EM = "V21";
const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const BIDANG_OPTIONS = [
  { value: "K", label: "Ketua Umum (K)" },
  { value: "WK", label: "Wakil Ketua Umum (WK)" },
  { value: "SB", label: "Sekretaris Bendahara (SB)" },
  { value: "PO", label: "Pengembangan Organisasi (PO)" },
  { value: "JN", label: "Jaringan (JN)" },
  { value: "LB", label: "Litbang (LB)" },
  { value: "MW", label: "Kemahasiswaan (MW)" },
  { value: "U", label: "Uki (U)" },
];

const SIFAT_OPTIONS = [
  { value: "01", label: "Internal (01)" },
  { value: "02", label: "Eksternal (02)" },
];

export default function GenerateSurat() {
  // 🚀 URL APPS SCRIPT BARU KAMU 🚀
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyt7onMCaqLNWJl6hKg2i26BRqM3HAGAIaMi4uWkU3Ls6uMs8_ctygTUyoEIfnP0jvl/exec";

  const [riwayatSurat, setRiwayatSurat] = useState<any[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // === STATE FORM INPUT ===
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [perihal, setPerihal] = useState("");
  const [pj, setPj] = useState("Abimanyu"); 
  const [bidang, setBidang] = useState("WK");
  const [sifat, setSifat] = useState("01");
  const [tujuanBulk, setTujuanBulk] = useState("");

  // === FETCH DATA RIWAYAT DARI SPREADSHEET ===
  const fetchRiwayat = async () => {
    setIsLoadingFetch(true);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setRiwayatSurat(data);
      } else {
        console.error("Data bukan array:", data);
      }
    } catch (error) {
      console.error("Gagal ambil data riwayat:", error);
    } finally {
      setIsLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // === MENGHITUNG NOMOR URUT SELANJUTNYA ===
  const startNoUrut = useMemo(() => {
    if (riwayatSurat.length === 0) return 1;
    const maxNo = Math.max(...riwayatSurat.map(s => parseInt(s.no) || 0));
    return maxNo + 1;
  }, [riwayatSurat]);

  // === CORE LOGIC: REAL-TIME GENERATION ===
  const generatedLetters = useMemo(() => {
    if (!tanggal) return [];

    const dateObj = new Date(tanggal);
    const monthRoman = ROMAN_MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const formattedTanggal = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${year}`;

    const destinations = tujuanBulk.split('\n').filter(line => line.trim() !== '');

    return destinations.map((tujuan, index) => {
      const currentUrut = startNoUrut + index;
      const paddedUrut = String(currentUrut).padStart(3, '0');
      
      const noSurat = `${paddedUrut}/${KODE_SV}/${KODE_EM}.${bidang}${sifat}.${monthRoman}/${year}`;

      return {
        no: currentUrut,
        noSurat,
        tanggal: formattedTanggal,
        tujuan: tujuan.trim(),
        perihal: perihal.trim(),
        pj: pj.trim()
      };
    });
  }, [tujuanBulk, perihal, bidang, sifat, tanggal, startNoUrut, pj]);

  // === HANDLER SIMPAN KE SPREADSHEET ===
  const handleSimpan = async () => {
    if (generatedLetters.length === 0 || !perihal || !pj || !tanggal) {
        alert("Harap isi Perihal, PJ, Tanggal, dan minimal 1 Tujuan Surat!");
        return;
    }

    setIsSaving(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(generatedLetters),
      });

      alert(`🎉 Yey! Berhasil generate & simpan ${generatedLetters.length} nomor surat ke Spreadsheet!`);
      
      setTujuanBulk("");
      setPerihal("");
      fetchRiwayat(); 
    } catch (error) {
      console.error("Gagal simpan:", error);
      alert("Yah, gagal menyimpan data. Cek koneksi internetmu ya!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-100px)] overflow-hidden animate-fade-in pr-2 pb-2">
        
        {/* === BAGIAN ATAS === */}
        <div className="flex flex-col lg:flex-row gap-6 shrink-0 lg:h-[55%]">
            
            {/* KIRI: FORM GENERATOR */}
            <div className="w-full lg:w-[55%] card-pastel p-6 flex flex-col shadow-xl border-white/60 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:shadow-pink-200/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
                
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-5 flex items-center gap-2">
                    <Layers size={22} className="text-pink-500" /> Form Generator Nomor
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 relative z-10">
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><CalendarIcon size={12}/> Tanggal Surat</label>
                        <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="h-11 bg-white/80 border-pink-100 rounded-xl focus:ring-pink-300 transition-all hover:bg-white" />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><PenTool size={12}/> Perihal / Isi</label>
                        <Input value={perihal} onChange={(e) => setPerihal(e.target.value)} className="h-11 bg-white/80 border-pink-100 rounded-xl focus:ring-pink-300 transition-all hover:bg-white" placeholder="Contoh: SIK Proposal Raker" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><User size={12}/> Penanggung Jawab</label>
                        <Input value={pj} onChange={(e) => setPj(e.target.value)} className="h-11 bg-white/80 border-pink-100 rounded-xl focus:ring-pink-300 transition-all hover:bg-white" placeholder="Nama PJ" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Bidang Proker</label>
                        <Select value={bidang} onValueChange={setBidang}>
                            <SelectTrigger className="h-11 bg-white/80 border-pink-100 rounded-xl focus:ring-pink-300 transition-all hover:bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl border-pink-100 shadow-xl">{BIDANG_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Sifat (IN/EKS)</label>
                        <Select value={sifat} onValueChange={setSifat}>
                            <SelectTrigger className="h-11 bg-white/80 border-pink-100 rounded-xl focus:ring-pink-300 transition-all hover:bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl border-pink-100 shadow-xl">{SIFAT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1 flex flex-col space-y-2 min-h-[120px] relative z-10">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-gray-500 uppercase">Tujuan Surat</label>
                        <span className="text-[10px] text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1 animate-pulse">
                            <Info size={12} /> Bulk Input (Enter untuk banyak tujuan)
                        </span>
                    </div>
                    <Textarea 
                        value={tujuanBulk} 
                        onChange={(e) => setTujuanBulk(e.target.value)} 
                        className="flex-1 bg-white/80 border-pink-100 rounded-xl resize-none p-4 focus:ring-pink-300 transition-all hover:bg-white leading-relaxed" 
                        placeholder="Ketik tujuan di sini...&#10;Gubernur BEM SV&#10;Wakil Dekan Bidang Kemahasiswaan" 
                    />
                </div>
            </div>

            {/* KANAN: PREVIEW SURAT BARU */}
            <div className="w-full lg:w-[45%] card-pastel p-6 flex flex-col shadow-xl border-white/60 bg-gradient-to-br from-white/80 to-pink-50/50 backdrop-blur-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Preview & Simpan
                        <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full font-bold">
                            {generatedLetters.length} Surat
                        </span>
                    </h2>
                    <Button 
                        onClick={handleSimpan} 
                        disabled={generatedLetters.length === 0 || !perihal || !pj || isSaving} 
                        className="h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95 px-6 font-bold"
                    >
                        {isSaving ? "Menyimpan..." : <><Save size={16} className="mr-2"/> Simpan ke Sheets</>}
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto bg-white/60 rounded-2xl border border-white/80 shadow-inner scrollbar-thin scrollbar-thumb-pink-200 relative z-10">
                    {generatedLetters.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center opacity-70">
                            <Hash size={40} className="text-pink-200 mb-2" />
                            <p className="font-medium text-sm">Preview nomor surat akan muncul di sini</p>
                        </div>
                    ) : (
                        <table className="w-full text-xs text-left">
                            <thead className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-20">
                                <tr>
                                    <th className="p-3 text-center text-gray-500 w-12 rounded-tl-2xl">No</th>
                                    <th className="p-3 text-gray-500">Nomor Surat Auto</th>
                                    <th className="p-3 text-gray-500 rounded-tr-2xl">Tujuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedLetters.map((s, i) => (
                                    <tr key={i} className="border-b border-pink-50 hover:bg-pink-100/50 transition-colors group/row">
                                        <td className="p-3 text-center font-bold text-pink-500">{s.no}</td>
                                        <td className="p-3 font-mono font-semibold text-gray-800 group-hover/row:text-purple-600 transition-colors">{s.noSurat}</td>
                                        <td className="p-3 text-gray-600 truncate max-w-[120px]" title={s.tujuan}>{s.tujuan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>

        {/* === BAGIAN BAWAH: TABEL RIWAYAT SPREADSHEET === */}
        <div className="flex-1 card-pastel p-6 flex flex-col shadow-xl border-white/60 bg-white/60 backdrop-blur-xl min-h-0 transition-all duration-300 hover:shadow-blue-100/40">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-2">
                    <FileText size={22} className="text-blue-500" /> Database Riwayat Surat
                </h2>
                <Button variant="outline" size="sm" onClick={fetchRiwayat} disabled={isLoadingFetch} className="h-9 rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50 font-medium shadow-sm transition-all active:scale-95 px-4">
                    <RefreshCw size={14} className={cn("mr-2", isLoadingFetch && "animate-spin")} /> Segarkan Data
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-md rounded-2xl border border-blue-50/50 shadow-inner scrollbar-thin scrollbar-thumb-blue-200">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md z-10">
                        <tr>
                            <th className="p-4 font-bold text-center w-16 rounded-tl-2xl">No</th>
                            <th className="p-4 font-bold min-w-[200px]">Nomor Surat</th>
                            <th className="p-4 font-bold min-w-[100px]">Tanggal</th>
                            <th className="p-4 font-bold min-w-[200px]">Tujuan Surat</th>
                            <th className="p-4 font-bold min-w-[200px]">Perihal / Isi</th>
                            <th className="p-4 font-bold rounded-tr-2xl">PJ</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {isLoadingFetch ? (
                            <tr><td colSpan={6} className="text-center p-10 text-gray-400 font-medium animate-pulse">Membaca data dari Spreadsheet...</td></tr>
                        ) : riwayatSurat.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-10 text-gray-400 font-medium">Belum ada data surat di spreadsheet.</td></tr>
                        ) : (
                            [...riwayatSurat].reverse().map((surat, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/40 transition-all duration-200">
                                    <td className="p-4 text-center font-bold text-gray-400">{surat.no}</td>
                                    <td className="p-4 font-mono font-bold text-indigo-600 text-xs tracking-tight">{surat.noSurat}</td>
                                    <td className="p-4 text-gray-500 font-medium text-xs whitespace-nowrap">{surat.tanggal}</td>
                                    <td className="p-4 text-gray-800 font-medium">{surat.tujuan}</td>
                                    <td className="p-4 text-gray-600 text-xs leading-relaxed">{surat.perihal}</td>
                                    <td className="p-4">
                                        <span className="text-gray-500 font-semibold text-xs bg-gray-100/80 rounded-lg px-2.5 py-1 whitespace-nowrap">
                                            {surat.pj}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </MainLayout>
  );
}
