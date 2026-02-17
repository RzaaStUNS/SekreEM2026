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

// === KONFIGURASI DIVISI ===
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

// === 🛠️ HELPER FIX TIMEZONE ===
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

        if (email.includes("ketum") && !email.includes("waketum")) {
          setIsAdmin(true);
          setUserDivision("all"); 
        } else {
          setIsAdmin(false);
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

  // List bulan untuk Dropdown (Januari 2026 - Desember 2026)
  const dropdownMonthList = monthNames.map((name, index) => ({
      value: index.toString(),
      label: `${name} 2026`
  }));

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
        
        {/* === SIDEBAR KIRI (KALENDER KECIL + FILTER) === */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4 flex flex-col h-full">
          
          {/* Kalender Kecil (Mini Calendar) */}
          <div className="card-pastel p-4 flex flex-col">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-foreground text-sm">
                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                 </h3>
                 <div className="flex gap-1">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1 hover:bg-muted rounded"><ChevronLeft size={14}/></button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1 hover:bg-muted rounded"><ChevronRight size={14}/></button>
                 </div>
             </div>
             
             {/* Grid Hari Mini */}
             <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground mb-1">
                {daysOfWeek.map(d => <div key={d}>{d}</div>)}
             </div>
             
             {/* Grid Tanggal Mini */}
             <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {getDaysInMonth(currentDate).map((day, i) => {
                    const isDayToday = day ? isToday(day) : false;
                    const hasProker = day ? getProkerForDate(day).length > 0 : false;
                    return (
                        <div key={i} className={cn(
                            "aspect-square flex items-center justify-center rounded-full cursor-pointer transition-all",
                            day ? "hover:bg-pink-100" : "",
                            isDayToday ? "bg-pink-500 text-white font-bold" : "",
                            !isDayToday && hasProker ? "bg-purple-100 text-purple-600 font-medium" : ""
                        )}
                        onClick={() => day && handleDateClick(day)}
                        >
                            {day}
                        </div>
                    )
                })}
             </div>
          </div>

          {/* Filter Divisi (Scrollable) */}
          <div className="card-pastel p-4 flex flex-col flex-1 min-h-[200px]">
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
            
            <div className="flex items-center gap-2">
                {/* Dropdown Pilih Bulan (Baru) */}
                <Select 
                    value={currentDate.getMonth().toString()} 
                    onValueChange={(val) => setCurrentDate(new Date(2026, parseInt(val), 1))}
                >
                    <SelectTrigger className="w-[140px] h-10 rounded-xl bg-white border-pink-100 shadow-sm text-xs font-medium">
                        <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {dropdownMonthList.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button 
                    onClick={() => setIsGuideOpen(true)}
                    variant="outline" 
                    className="rounded-full w-10 h-10 p-0 border-pink-pastel/30 text-pink-pastel hover:bg-pink-pastel hover:text-white"
                    title="Panduan Kalender"
                >
                    <HelpCircle size={20} />
                </Button>
            </div>
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
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 gap-0 overflow-hidden animate-in zoom-in-95 duration-300">
          
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 border-b border-pink-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-pink-500">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-normal text-muted-foreground">Jadwal Tanggal</span>
                    {selectedDate?.getDate()} {selectedDate ? monthNames[selectedDate.getMonth()] : ""} {selectedDate?.getFullYear()}
                  </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
             {selectedDateProkers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada kegiatan nih 💤</p>
                </div>
             ) : (
                selectedDateProkers.map((proker) => {
                    const isMyProker = isAdmin || proker.division === userDivision;
                    return (
                        <div key={proker.id} onClick={() => handleProkerSelect(proker)} className="group relative flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01]">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-1.5 h-10 rounded-full", getDivisionColor(proker.division))} />
                                <div>
                                    <h4 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1 text-base">{proker.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <span className={cn("px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-sm", getDivisionColor(proker.division))}>
                                            {getDivisionLabel(proker.division)}
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                            <Clock size={10} /> {proker.time || "Sepanjang hari"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                                {isMyProker ? <Edit3 size={16} /> : <Eye size={16} />}
                            </div>
                        </div>
                    )
                })
             )}
          </div>

          <div className="p-4 border-t bg-gray-50/50">
            <Button onClick={() => selectedDate && openCreateForm(selectedDate)} className="w-full h-12 rounded-xl bg-gradient-to-r from-baby-blue to-lavender hover:opacity-90 text-white font-bold shadow-lg shadow-blue-100 transition-transform active:scale-95">
                <Plus size={18} className="mr-2" /> Tambah Kegiatan Baru
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === POPUP FORMULIR === */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 gap-0 overflow-hidden animate-in zoom-in-95 duration-300">
          
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <DialogHeader className="relative z-10">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {!canEdit ? ( 
                    <> <Lock size={24} className="opacity-80" /> <span>Detail Proker</span> </> 
                ) : (
                    <> {editingProker ? <Edit3 size={24} className="opacity-80"/> : <Plus size={24} className="opacity-80"/>} 
                       <span>{editingProker ? "Edit Program Kerja" : "Tambah Program Kerja"}</span> 
                    </>
                )}
                </DialogTitle>
                <DialogDescription className="text-white/80">
                    {editingProker ? "Perbarui detail kegiatan ini." : "Isi detail untuk menambahkan kegiatan baru."}
                </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {!canEdit && (
                <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-200 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="shrink-0 mt-0.5 text-amber-600" size={20} />
                    <div className="text-sm">
                        <strong className="font-semibold">Mode Baca Saja</strong>
                        <p className="opacity-90 text-xs mt-0.5">Anda hanya dapat melihat proker dari divisi lain.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Kegiatan</label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-pink-200 rounded-xl transition-all font-medium" 
                    placeholder="Contoh: Rapat Kerja Perdana"
                    disabled={!canEdit} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Divisi Penanggung Jawab</label>
                <Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })} disabled={!isAdmin || !canEdit}>
                    <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200">
                        <SelectValue placeholder="Pilih divisi..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        {divisions.map(div => (
                            <SelectItem key={div.value} value={div.value} className="rounded-lg my-1 cursor-pointer focus:bg-pink-50">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", div.color)} /> {div.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {!isAdmin && <p className="text-[10px] text-muted-foreground ml-1 flex items-center gap-1"><Lock size={10} /> Otomatis sesuai divisi Anda.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><CalendarIcon size={12} /> Mulai</label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200" disabled={!canEdit} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><CalendarIcon size={12} /> Selesai</label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200" disabled={!canEdit} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><Clock size={12} /> Waktu</label>
                    <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200" disabled={!canEdit} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1"><Link2 size={12} /> Link Dokumen</label>
                    <Input placeholder="https://..." value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200" disabled={!canEdit} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Deskripsi</label>
                <Textarea placeholder="Tuliskan detail kegiatan di sini..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px] bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 resize-none" disabled={!canEdit} />
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t bg-gray-50/50 flex gap-3">
            {canEdit ? (
                <>
                    {editingProker && (
                        <Button onClick={handleDelete} variant="destructive" className="h-12 w-12 p-0 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 shadow-sm" title="Hapus">
                            <Trash2 size={20} />
                        </Button>
                    )}
                    <Button onClick={() => { setIsFormOpen(false); resetForm(); }} variant="outline" className="h-12 flex-1 rounded-xl border-gray-200 hover:bg-gray-100 font-medium text-gray-600">
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name || !formData.division} className="h-12 flex-[2] rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold shadow-lg shadow-purple-200 transition-transform active:scale-95">
                        {editingProker ? "Simpan Perubahan" : "Buat Proker"}
                    </Button>
                </>
            ) : (
                <Button onClick={() => { setIsFormOpen(false); resetForm(); }} className="w-full h-12 rounded-xl bg-gray-800 text-white hover:bg-gray-700">
                    Tutup
                </Button>
            )}
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
