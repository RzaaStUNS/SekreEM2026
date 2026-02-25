import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Send, User, Calendar, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// === OPSI SESUAI SPREADSHEET ===
const BIDANG_OPTIONS = [
  "Ketua", "Wakil Ketua", "Sekbend", "POK", "Mawa", "Jaringan", "Litbang", "Umum (External EM)"
];

const PERIHAL_OPTIONS = [
  "Peminjaman Tempat", "Peminjaman Barang/Alat", "Undangan", "SIK (Surat Izin Kegiatan)", "Lainnya"
];

const REQUEST_TYPE_OPTIONS = [
  "No. Surat/Sertifikat/Undangan", 
  "No. Surat beserta isi Surat/Sertifikat/Undangan"
];

export default function FormRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State Data Form
  const [formData, setFormData] = useState({
    nama: "",
    wa: "",
    jenisRequest: "",
    bidang: "",
    perihal: "",
    tujuan: "",
    kegiatan: "",
    tglPelaksanaan: "",
    deadline: ""
  });

  // Handler Input
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Dasar
    if(!formData.nama || !formData.wa || !formData.jenisRequest || !formData.bidang || !formData.perihal) {
        alert("Harap lengkapi data yang bertanda bintang (*)!");
        return;
    }

    setIsLoading(true);

    try {
      // 🚀 URL APPS SCRIPT MILIKMU SUDAH DIPASANG DI SINI 🚀
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyUE_BCEGzgFvYhOp3l64J4sHDdRqsyv3vZD0kZFhMVCsngocv28QzLjU-j7EAEiZc/exec";

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Wajib untuk Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      // Munculkan layar sukses
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengirim data. Cek koneksi internet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logic Generate Pesan WA
  const handleContactCP = (cpName: string, cpNumber: string) => {
    // Format Tanggal (misal: 2026-03-17 jadi 17 Maret 2026)
    const formatDateIndo = (dateStr: string) => {
        if(!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Template Pesan WA Otomatis
    const text = `Halo ${cpName},

Aku *${formData.nama}* dengan nomor wa *${formData.wa}* mau request *${formData.jenisRequest}*

untuk acara proker bidang *${formData.bidang}*
dengan perihal/isi *${formData.perihal}*
dengan tujuan surat *${formData.tujuan || "-"}*
dan untuk *${formData.kegiatan || "-"}*

pada tanggal *${formatDateIndo(formData.tglPelaksanaan)}*
dengan maksimal tanggal surat *${formatDateIndo(formData.deadline)}*`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${cpNumber}?text=${encodedText}`, "_blank");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in pb-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-2 flex items-center justify-center gap-3">
             Form Request Surat
             <span className="text-2xl">📝</span>
          </h1>
          <p className="text-muted-foreground text-sm">
             Isi form di bawah, data akan otomatis masuk ke Spreadsheet Sekre.
          </p>
        </div>

        <div className="card-pastel overflow-hidden shadow-xl border-white/50 bg-white/80 backdrop-blur-md">
            
            {/* === SCREEN 2: SUKSES & KONFIRMASI WA === */}
            {isSuccess ? (
                <div className="p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Berhasil Disimpan! 🎉</h2>
                    <p className="text-gray-600 max-w-md mb-8">
                        Data kamu sudah masuk ke Spreadsheet. Silakan <strong>klik salah satu CP</strong> di bawah untuk konfirmasi via WhatsApp (Pesan sudah otomatis terisi).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <Button 
                            onClick={() => handleContactCP("Abimanyu", "6282133751840")} 
                            className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 rounded-2xl shadow-lg shadow-green-100 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
                        >
                            <MessageCircle className="mr-2" /> Chat Abimanyu
                        </Button>
                        <Button 
                            onClick={() => handleContactCP("Aldifa", "6285720243561")} 
                            className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 rounded-2xl shadow-lg shadow-green-100 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
                        >
                            <MessageCircle className="mr-2" /> Chat Aldifa
                        </Button>
                    </div>

                    <Button 
                        variant="ghost" 
                        className="mt-6 text-muted-foreground hover:bg-transparent hover:text-pink-500"
                        onClick={() => { setIsSuccess(false); setFormData({ nama: "", wa: "", jenisRequest: "", bidang: "", perihal: "", tujuan: "", kegiatan: "", tglPelaksanaan: "", deadline: "" }); }}
                    >
                        Buat Request Lain
                    </Button>
                </div>
            ) : (
            
            /* === SCREEN 1: FORM INPUT === */
            <form onSubmit={handleSubmit}>
                <div className="h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300" />

                <div className="p-6 space-y-8">
                    
                    {/* SECTION: DATA DIRI */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-pink-500 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <User size={20}/> Data Diri
                        </h3>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Siapa Namamu? <span className="text-red-500">*</span></label>
                                <Input required placeholder="Nama Panggilan/Lengkap" value={formData.nama} onChange={(e) => handleChange("nama", e.target.value)} className="h-12 bg-white border-pink-100 focus:ring-pink-200 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nomor WA Aktif <span className="text-red-500">*</span></label>
                                <Input required type="tel" placeholder="08xxxxx / 628xxxxx" value={formData.wa} onChange={(e) => handleChange("wa", e.target.value)} className="h-12 bg-white border-pink-100 focus:ring-pink-200 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: DETAIL SURAT */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-purple-500 flex items-center gap-2 border-b border-purple-100 pb-2">
                            <FileText size={20}/> Detail Surat
                        </h3>
                        
                        {/* Jenis Request (Radio) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mau request apa nih? <span className="text-red-500">*</span></label>
                            <RadioGroup value={formData.jenisRequest} onValueChange={(val) => handleChange("jenisRequest", val)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {REQUEST_TYPE_OPTIONS.map((opt) => (
                                    <div key={opt} className={cn("flex items-center space-x-3 border p-3 rounded-xl cursor-pointer transition-all hover:bg-purple-50", formData.jenisRequest === opt ? "border-purple-400 bg-purple-50 ring-1 ring-purple-200" : "border-gray-200 bg-white")}>
                                        <RadioGroupItem value={opt} id={opt} className="text-purple-500 border-purple-300" />
                                        <label htmlFor={opt} className="text-sm cursor-pointer w-full font-medium text-gray-700 leading-snug">{opt}</label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Bidang */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Proker Bidang Apa? <span className="text-red-500">*</span></label>
                                <Select value={formData.bidang} onValueChange={(val) => handleChange("bidang", val)}>
                                    <SelectTrigger className="h-12 bg-white border-purple-100 rounded-xl"><SelectValue placeholder="Pilih Bidang..." /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{BIDANG_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>

                            {/* Perihal */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Perihal / Isi <span className="text-red-500">*</span></label>
                                <Select value={formData.perihal} onValueChange={(val) => handleChange("perihal", val)}>
                                    <SelectTrigger className="h-12 bg-white border-purple-100 rounded-xl"><SelectValue placeholder="Pilih Perihal..." /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{PERIHAL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tujuan Surat</label>
                                <Input placeholder="Yth. Siapa..." value={formData.tujuan} onChange={(e) => handleChange("tujuan", e.target.value)} className="h-12 bg-white border-purple-100 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Kegiatan/Acara</label>
                                <Input placeholder="Nama Acara..." value={formData.kegiatan} onChange={(e) => handleChange("kegiatan", e.target.value)} className="h-12 bg-white border-purple-100 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: WAKTU */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-blue-500 flex items-center gap-2 border-b border-blue-100 pb-2">
                            <Calendar size={20}/> Waktu Penting
                        </h3>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tanggal Pelaksanaan</label>
                                <Input type="date" value={formData.tglPelaksanaan} onChange={(e) => handleChange("tglPelaksanaan", e.target.value)} className="h-12 bg-white border-blue-100 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 text-red-500">Deadline Request (H-1) <span className="text-red-500">*</span></label>
                                <Input required type="date" value={formData.deadline} onChange={(e) => handleChange("deadline", e.target.value)} className="h-12 bg-white border-red-200 focus:ring-red-200 rounded-xl" />
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* FOOTER */}
                <div className="p-6 pt-0 pb-8">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 rounded-2xl shadow-lg shadow-purple-200 text-white font-bold text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <> <Loader2 className="animate-spin" /> Sedang Mengirim... </>
                        ) : (
                            <> <Send size={20} /> Kirim Request Sekarang </>
                        )}
                    </Button>
                </div>
            </form>
            )}
        </div>
      </div>
    </MainLayout>
  );
}
