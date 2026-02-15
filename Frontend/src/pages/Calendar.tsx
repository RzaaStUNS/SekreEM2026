import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Link2, Trash2, Lock, AlertCircle, Eye, Edit3, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// === TIPE DATA ===
interface Proker {
  id: string;
  name: string;
  division: string;
  startDate: Date;
  endDate: Date;
  time?: string;
  description?: string;
  link?: string;
}

// === KONFIGURASI DIVISI (LENGKAP) ===
const divisions = [
  { value: "wakahim", label: "Wakil Ketua Umum", color: "bg-purple-500" },
  { value: "sekretaris", label: "Sekretaris Umum", color: "bg-pink-500" },
  { value: "bendahara", label: "Bendahara Umum", color: "bg-yellow-500" },
  { value: "personalia", label: "Biro Personalia", color: "bg-blue-500" },
  { value: "ekraf", label: "Ekonomi Kreatif", color: "bg-green-500" },
  { value: "psdm", label: "PSDM", color: "bg-orange-500" },
  { value: "mikat", label: "Minat & Bakat", color: "bg-red-500" },
  { value: "humas", label: "Hubungan Masyarakat", color: "bg-teal-500" },
  { value: "sosma", label: "Sosial Masyarakat", color: "bg-indigo-500" },
  { value: "medinfo", label: "Media & Informasi", color: "bg-cyan-500" },
  { value: "rnd", label: "Riset & Data", color: "bg-gray-500" },
];

const getDivisionColor = (division: string) => {
  return divisions.find(d => d.value === division)?.color || "bg-gray-400";
};

const getDivisionLabel = (division: string) => {
    return divisions.find(d => d.value === division)?.label || "Lainnya";
};

const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// === 🛠️ HELPER FIX TIMEZONE (Agar tanggal tidak mundur) ===
const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Calendar() {
  // === CONFIG API ===
  const API_BASE_URL = "https://sekreem2026-production.up.railway.app/api"; 
  const API_URL = `${API_BASE_URL}/prokers`; 

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(divisions.map(d => d.value));
  
  // === MODAL STATE ===
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [isListOpen, setIsListOpen] = useState(false); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateProkers, setSelectedDateProkers] = useState<Proker[]>([]);
  const [editingProker, setEditingProker] = useState<Proker | null>(null);

  // === USER STATE ===
  const [userDivision, setUserDivision] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // === DATA PROKER ===
  const [prokers, setProkers] = useState<Proker[]>([]);

  const [formData, setFormData] = useState({
    name: "", division: "", startDate: "", endDate: "", time: "", description: "", link: "",
  });

  // === FETCH DATA ===
  const fetchProkers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedData = response.data.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate)
      }));
      setProkers(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data proker:", error);
    }
  };

  // === 1. DETEKSI USER & LOAD DATA ===
  useEffect(() => {
    fetchProkers(); 

    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const email = (user.email || "").toLowerCase();

        // Admin: Ketum & Waketum
        if (email.includes("ketum") && !email.includes("waketum")) {
          setIsAdmin(true);
          setUserDivision("all"); 
        } else {
          setIsAdmin(false);
          // Mapping Divisi
          if (email.includes("waketum")) setUserDivision("wakahim");
          else if (email.includes("sekum")) setUserDivision("sekretaris");
          else if (email.includes("bendum")) setUserDivision("bendahara");
          else if (email.includes("personalia")) setUserDivision("personalia");
          else if (email.includes("ekraf")) setUserDivision("ekraf");
          else if (email.includes("psdm")) setUserDivision("psdm");
          else if (email.includes("mikat")) setUserDivision("mikat");
          else if (email.includes("humas")) setUserDivision("humas");
          else if (email.includes("sosma")) setUserDivision("sosma");
          else if (email.includes("medinfo")) setUserDivision("medinfo");
          else if (email.includes("rnd")) setUserDivision("rnd");
          else setUserDivision("unknown");
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const hasSeenGuide = sessionStorage.getItem("hasSeenCalendarGuide");
    if (!hasSeenGuide) {
        setIsGuideOpen(true);
        sessionStorage.setItem("hasSeenCalendarGuide", "true");
    }
  }, []);

  // === HELPER UTILS ===
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  // === GENERATOR LIST BULAN (SIDEBAR) ===
  const generateMonthList = () => {
    const months = [];
    const start = new Date(2026, 0, 1); // Januari 2026
    const end = new Date(2027, 1, 1);   // Februari 2027
    
    const current = new Date(start);
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };
  
  const monthNavigationList = generateMonthList();

  const getProkerForDate = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return prokers.filter(p => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return selectedDivisions.includes(p.division) && 
             checkDate >= new Date(start.setHours(0,0,0,0)) && 
             checkDate <= new Date(end.setHours(23,59,59,999));
    });
  };

  // === HANDLERS ===
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const prokersOnDate = getProkerForDate(day);
    setSelectedDate(clickedDate);

    if (prokersOnDate.length > 0) {
        setSelectedDateProkers(prokersOnDate);
        setIsListOpen(true);
    } else {
        openCreateForm(clickedDate);
    }
  };

  const openCreateForm = (date: Date) => {
    const dateString = formatDateLocal(date); 

    setEditingProker(null);
    setFormData({
        name: "",
        division: isAdmin ? "" : userDivision,
        startDate: dateString,
        endDate: dateString,
        time: "",
        description: "",
        link: ""
    });
    setIsListOpen(false);
    setIsFormOpen(true);
  };

  const handleProkerSelect = (proker: Proker) => {
    setEditingProker(proker);
    setFormData({
        name: proker.name,
        division: proker.division,
        startDate: formatDateLocal(proker.startDate),
        endDate: formatDateLocal(proker.endDate),
        time: proker.time || "",
        description: proker.description || "",
        link: proker.link || "",
    });
    setIsListOpen(false);
    setIsFormOpen(true);
  };

 const handleSave = async () => {
    if (!formData.division) {
        alert("Divisi harus diisi!");
        return;
    }
    if (editingProker && !isAdmin && editingProker.division !== userDivision) {
        alert("Akses Ditolak: Anda tidak bisa mengedit proker divisi lain.");
        return;
    }
    const finalDivision = isAdmin ? formData.division : userDivision;
    
    const payload = {
        ...formData,
        division: finalDivision,
    };

    try {
      const token = localStorage.getItem("auth_token");
      const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      };

      if (editingProker) {
        await axios.put(`${API_URL}/${editingProker.id}`, payload, config);
      } else {
        await axios.post(API_URL, payload, config);
      }

      fetchProkers(); 
      setIsFormOpen(false);
      resetForm();
      alert("Berhasil menyimpan proker! 🎉");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan: " + (err.response?.data?.message || "Cek koneksi internet"));
    }
  };

  const handleDelete = async () => {
    if (editingProker) {
       try {
         const token = localStorage.getItem("auth_token");
         await axios.delete(`${API_URL}/${editingProker.id}`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         
         fetchProkers();
         setIsFormOpen(false);
         resetForm();
       } catch (err) {
         alert("Gagal menghapus data.");
       }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", division: "", startDate: "", endDate: "", time: "", description: "", link: "" });
    setEditingProker(null);
  };

  const toggleDivision = (division: string) => {
    setSelectedDivisions(prev =>
      prev.includes(division) ? prev.filter(d => d !== division) : [...prev, division]
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const canEdit = isAdmin || (!editingProker) || (editingProker && editingProker.division === userDivision);

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)] overflow-hidden animate-fade-in pr-2 pb-2">
        
        {/* === SIDEBAR (FIXED HEIGHT, SCROLLABLE INSIDE) === */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4 flex flex-col h-full">
          
          {/* Card List Bulan (Scrollable) */}
          <div className="card-pastel p-4 flex flex-col h-1/2 min-h-[200px]">
             <h3 className="font-bold text-foreground mb-3 text-center lg:text-left flex items-center gap-2 shrink-0">
              <CalendarIcon size={18} className="text-pink-pastel"/> 
              Pilih Bulan
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-pink-200 hover:scrollbar-thumb-pink-300">
              {monthNavigationList.map((m, idx) => {
                const isSelected = m.getMonth() === currentDate.getMonth() && m.getFullYear() === currentDate.getFullYear();
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentDate(new Date(m))}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      isSelected 
                        ? "bg-gradient-to-r from-pink-pastel to-purple-400 text-white shadow-md transform scale-[1.02]" 
                        : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {monthNames[m.getMonth()]} {m.getFullYear()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Divisi (Scrollable) */}
          <div className="card-pastel p-4 flex flex-col h-1/2 min-h-[200px]">
            <h3 className="font-bold text-foreground mb-3 text-sm shrink-0">Filter Divisi</h3>
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {divisions.map(div => (
                    <label key={div.value} className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-muted/50 rounded-lg">
                    <input type="checkbox" checked={selectedDivisions.includes(div.value)} onChange={() => toggleDivision(div.value)} className="hidden" />
                    <div className={cn("w-3 h-3 rounded-full transition-all ring-2 ring-offset-1", div.color, selectedDivisions.includes(div.value) ? "ring-opacity-100 scale-110" : "ring-opacity-0 scale-100 grayscale opacity-50")} />
                    <span className={cn("text-xs font-medium", selectedDivisions.includes(div.value) ? "text-foreground" : "text-muted-foreground")}>{div.label}</span>
                    </label>
                ))}
                </div>
            </div>
          </div>
        </div>

        {/* MAIN CALENDAR (AUTO RESIZE) */}
        <div className="flex-1 card-pastel p-4 lg:p-6 overflow-hidden flex flex-col shadow-lg border-white/50 h-full">
          <div className="flex items-center justify-between mb-4 gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-pastel to-purple-500">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1.5 rounded-lg hover:bg-white"><ChevronLeft size={20} /></button>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1.5 rounded-lg hover:bg-white"><ChevronRight size={20} /></button>
              </div>
            </div>
            
            <Button 
                onClick={() => setIsGuideOpen(true)}
                variant="outline" 
                className="rounded-full w-10 h-10 p-0 border-pink-pastel/30 text-pink-pastel hover:bg-pink-pastel hover:text-white"
                title="Panduan Kalender"
            >
                <HelpCircle size={20} />
            </Button>
          </div>

          {/* Grid Kalender (Scrollable Inside) */}
          <div className="flex-1 overflow-y-auto bg-white/50 rounded-3xl p-4 border border-white/60 scrollbar-hide">
            <div className="grid grid-cols-7 gap-2 mb-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 rounded-xl shadow-sm">
              {daysOfWeek.map(day => <div key={day} className="text-center text-sm font-bold text-muted-foreground">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 auto-rows-fr">
              {getDaysInMonth(currentDate).map((day, i) => {
                const dayProkers = day ? getProkerForDate(day) : [];
                return (
                  <div key={i} onClick={() => day && handleDateClick(day)} className={cn("min-h-[100px] p-2 rounded-2xl border transition-all relative group flex flex-col", day ? "bg-white border-border/40 hover:border-pink-pastel/50 hover:shadow-md cursor-pointer" : "bg-muted/10 border-transparent")}>
                    {day && (
                      <>
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold mb-2 shrink-0", isToday(day) ? "bg-pink-pastel text-white shadow-sm" : "text-muted-foreground group-hover:text-foreground")}>{day}</div>
                        <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-pink-100">
                          {dayProkers.map(proker => (
                            <div key={proker.id} className={cn("text-[10px] px-2 py-1 rounded-md truncate text-white font-medium shadow-sm", getDivisionColor(proker.division))}>
                              {proker.name}
                            </div>
                          ))}
                        </div>
                        {/* Tombol Plus Saat Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-2xl pointer-events-none">
                              <Plus className="text-pink-pastel drop-shadow-md" size={32} />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* === POPUP LIST KEGIATAN === */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="text-pink-pastel" />
                Jadwal {selectedDate?.getDate()} {selectedDate ? monthNames[selectedDate.getMonth()] : ""}
            </DialogTitle>
            <DialogDescription>Daftar kegiatan pada tanggal ini:</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3 max-h-[60vh] overflow-y-auto px-1 scrollbar-thin">
             {selectedDateProkers.map((proker) => {
                 const isMyProker = isAdmin || proker.division === userDivision;
                 return (
                    <div key={proker.id} onClick={() => handleProkerSelect(proker)} className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-border hover:border-pink-pastel/50 hover:shadow-md cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-10 rounded-full", getDivisionColor(proker.division))} />
                            <div>
                                <h4 className="font-bold text-foreground group-hover:text-pink-pastel transition-colors line-clamp-1">{proker.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={cn("px-1.5 py-0.5 rounded text-white text-[10px] font-bold", getDivisionColor(proker.division))}>{getDivisionLabel(proker.division)}</span>
                                    <span>• {proker.time || "-"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-muted-foreground group-hover:text-foreground">{isMyProker ? <Edit3 size={18} /> : <Eye size={18} />}</div>
                    </div>
                 )
             })}
          </div>
          <Button onClick={() => selectedDate && openCreateForm(selectedDate)} className="w-full h-12 rounded-xl bg-gradient-to-r from-baby-blue to-lavender text-white font-bold shadow-lg hover:opacity-90 mt-2">
            <Plus size={18} className="mr-2" /> Tambah Proker Baru
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {!canEdit ? ( <div className="flex items-center gap-2 text-muted-foreground"><Lock size={24} /> <span>Detail Program Kerja</span></div> ) : (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-pastel to-purple-500">{editingProker ? "Edit Program Kerja" : "Tambah Program Kerja"}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {!canEdit && <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-100 flex items-start gap-3"><AlertCircle className="shrink-0 mt-0.5" size={18} /><div className="text-sm"><strong>Mode Baca Saja</strong><p className="opacity-90 text-xs mt-0.5">Anda hanya dapat melihat proker dari divisi lain.</p></div></div>}
            <div className="grid gap-4">
              <div><label className="text-sm font-bold text-foreground/80 mb-1.5 block">Nama Program Kerja</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 bg-muted/20 border-border/50 rounded-xl" disabled={!canEdit} /></div>
              <div>
                <label className="text-sm font-bold text-foreground/80 mb-1.5 block">Divisi Penanggung Jawab</label>
                
                {/* 🛠️ LOGIC DISABLED YANG DIPERBAIKI (Hanya Admin yang bisa ganti) */}
                <Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })} disabled={!isAdmin || !canEdit}>
                    <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl"><SelectValue placeholder="Pilih divisi..." /></SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-xl">
                        {divisions.map(div => (<SelectItem key={div.value} value={div.value} className="rounded-lg my-0.5 cursor-pointer"><div className="flex items-center gap-2"><div className={cn("w-3 h-3 rounded-full shadow-sm", div.color)} />{div.label}</div></SelectItem>))}
                    </SelectContent>
                </Select>
                {!isAdmin && <p className="text-[10px] text-muted-foreground mt-1.5 ml-1 flex items-center gap-1"><Lock size={10} /> Otomatis terpilih sesuai Divisi Anda.</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-foreground/80 mb-1.5 flex items-center gap-2"><CalendarIcon size={14} className="text-pink-pastel" /> Mulai</label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="h-12 bg-muted/20 border-border/50 rounded-xl" disabled={!canEdit} /></div>
                <div><label className="text-sm font-bold text-foreground/80 mb-1.5 flex items-center gap-2"><CalendarIcon size={14} className="text-pink-pastel" /> Selesai</label><Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="h-12 bg-muted/20 border-border/50 rounded-xl" disabled={!canEdit} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-foreground/80 mb-1.5 flex items-center gap-2"><Clock size={14} className="text-baby-blue" /> Waktu</label><Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="h-12 bg-muted/20 border-border/50 rounded-xl" disabled={!canEdit} /></div>
                <div><label className="text-sm font-bold text-foreground/80 mb-1.5 flex items-center gap-2"><Link2 size={14} className="text-baby-blue" /> Link Dokumen</label><Input placeholder="https://..." value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="h-12 bg-muted/20 border-border/50 rounded-xl" disabled={!canEdit} /></div>
              </div>
              <div><label className="text-sm font-bold text-foreground/80 mb-1.5 block">Deskripsi Kegiatan</label><Textarea placeholder="Jelaskan detail kegiatan..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-muted/20 border-border/50 rounded-xl resize-none" rows={3} disabled={!canEdit} /></div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            {canEdit && <Button onClick={handleSave} disabled={!formData.name || !formData.division} className="flex-1 h-12 bg-gradient-to-r from-baby-blue to-lavender hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95">Simpan Proker</Button>}
            <Button onClick={() => { setIsFormOpen(false); resetForm(); }} variant="outline" className="h-12 px-6 border-border text-muted-foreground hover:bg-muted rounded-xl flex-1 font-medium">{canEdit ? "Batal" : "Tutup"}</Button>
            {editingProker && canEdit && <Button onClick={handleDelete} variant="outline" className="h-12 px-4 border-red-100 bg-red-50 text-destructive hover:bg-red-100 rounded-xl"><Trash2 size={20} /></Button>}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* GUIDE DIALOG */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
         <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-pink-pastel to-purple-400 p-6 text-white text-center">
                <CalendarIcon size={48} className="mx-auto mb-3 opacity-90" />
                <h2 className="text-2xl font-bold">Selamat Datang di Kalender!</h2>
                <p className="opacity-90 mt-1">Kelola proker BEM dengan mudah dan estetik ✨</p>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-baby-blue/20 text-baby-blue flex items-center justify-center font-bold shrink-0">1</div>
                    <div><h4 className="font-bold text-foreground">Lihat Jadwal</h4><p className="text-sm text-muted-foreground">Klik tanggal untuk melihat daftar proker di hari itu.</p></div>
                </div>
                <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-pink-pastel/20 text-pink-pastel flex items-center justify-center font-bold shrink-0">2</div>
                     <div><h4 className="font-bold text-foreground">Tambah Proker</h4><p className="text-sm text-muted-foreground">Pilih tanggal, lalu klik tombol tambah. Divisi akan terisi otomatis sesuai akunmu.</p></div>
                </div>
                <Button onClick={() => setIsGuideOpen(false)} className="w-full bg-foreground text-white rounded-xl mt-2">Mengerti, Gass!</Button>
            </div>
         </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
