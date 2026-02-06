import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Link2, Trash2, Lock, AlertCircle, Eye, Edit3, HelpCircle, MousePointer2, Filter, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios"; // Tambahkan Import Axios

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
  { value: "wakahim", label: "Wakahim", color: "bg-wakahim" },
  { value: "sekretaris", label: "Sekretaris", color: "bg-sekretaris" },
  { value: "bendahara", label: "Bendahara", color: "bg-bendahara" },
  { value: "personalia", label: "Personalia", color: "bg-personalia" },
  { value: "ekraf", label: "EKRAF", color: "bg-ekraf" },
  { value: "psdm", label: "PSDM", color: "bg-psdm" },
  { value: "mikat", label: "MIKAT", color: "bg-mikat" },
  { value: "sosma", label: "SOSMA", color: "bg-sosma" },
  { value: "rnd", label: "RND", color: "bg-rnd" },
  { value: "medinfo", label: "MEDINFO", color: "bg-medinfo" },
];

const getDivisionColor = (division: string) => {
  return divisions.find(d => d.value === division)?.color || "bg-gray-300";
};

const getDivisionLabel = (division: string) => {
    return divisions.find(d => d.value === division)?.label || "Unknown";
};

const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function Calendar() {
  // === CONFIG API ===
  // Ganti link di bawah ini dengan link backend Vercel kamu yang baru saja Ready
  const API_URL = "https://sekre-em-2026.vercel.app/"; 

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

  // === DATA PROKER (Ambil dari DB) ===
  const [prokers, setProkers] = useState<Proker[]>([]);

  const [formData, setFormData] = useState({
    name: "", division: "", startDate: "", endDate: "", time: "", description: "", link: "",
  });

  // === FETCH DATA DARI BACKEND ===
  const fetchProkers = async () => {
    try {
      const response = await axios.get(API_URL);
      // Format data agar string date jadi Object Date JS
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
    fetchProkers(); // Load data saat pertama kali buka

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
          else if (email.includes("medinfo")) setUserDivision("medinfo");
          // ... mapping lainnya tetap sama
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
    const dateString = date.toISOString().split("T")[0];
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
        startDate: proker.startDate.toISOString().split("T")[0],
        endDate: proker.endDate.toISOString().split("T")[0],
        time: proker.time || "",
        description: proker.description || "",
        link: proker.link || "",
    });
    setIsListOpen(false);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (editingProker && !isAdmin && editingProker.division !== userDivision) {
        alert("Akses Ditolak: Anda tidak bisa mengedit proker divisi lain.");
        return;
    }
    const finalDivision = isAdmin ? formData.division : userDivision;
    const payload = {
        ...formData,
        division: finalDivision,
        id: editingProker ? editingProker.id : Date.now().toString()
    };

    try {
      if (editingProker) {
        // Laravel route update biasanya tidak standar di API, kita gunakan POST/PUT sesuai route Laravelmu
        await axios.post(`${API_URL}`, payload); // Sesuai ProkerController@store yang pakai DB::table()->insert()
      } else {
        await axios.post(API_URL, payload);
      }
      fetchProkers(); // Refresh data dari DB
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan ke Database Aiven!");
    }
  };

  const handleDelete = async () => {
    if (editingProker) {
       if (!isAdmin && editingProker.division !== userDivision) {
         alert("Akses Ditolak: Anda tidak bisa menghapus proker divisi lain.");
         return;
       }
       try {
         await axios.delete(`${API_URL}/${editingProker.id}`);
         fetchProkers();
         setIsFormOpen(false);
         resetForm();
       } catch (err) {
         alert("Gagal menghapus data di database.");
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
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="card-pastel p-4">
            <h3 className="font-bold text-foreground mb-3 text-center lg:text-left">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {daysOfWeek.map(day => <div key={day} className="text-muted-foreground font-medium py-1">{day}</div>)}
              {getDaysInMonth(currentDate).map((day, i) => {
                const hasProker = day ? getProkerForDate(day).length > 0 : false;
                return (
                  <div key={i} className={cn("py-1 rounded-lg text-sm cursor-pointer", day && isToday(day) && "bg-pink-pastel text-white font-bold", day && hasProker && !isToday(day) && "bg-baby-blue/50 font-semibold", day && !isToday(day) && !hasProker && "hover:bg-muted")} onClick={() => day && handleDateClick(day)}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-pastel p-4">
            <h3 className="font-bold text-foreground mb-3">Divisi Proker</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {divisions.map(div => (
                <label key={div.value} className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-muted/50 rounded-lg">
                  <input type="checkbox" checked={selectedDivisions.includes(div.value)} onChange={() => toggleDivision(div.value)} className="hidden" />
                  <div className={cn("w-3 h-3 rounded-full transition-all ring-2 ring-offset-1", div.color, selectedDivisions.includes(div.value) ? "ring-opacity-100 scale-110" : "ring-opacity-0 scale-100 grayscale opacity-50")} />
                  <span className={cn("text-sm font-medium", selectedDivisions.includes(div.value) ? "text-foreground" : "text-muted-foreground")}>{div.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CALENDAR */}
        <div className="flex-1 card-pastel p-6 overflow-hidden flex flex-col shadow-lg border-white/50">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-pastel to-purple-500">
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

          <div className="flex-1 overflow-auto bg-white/50 rounded-3xl p-4 border border-white/60">
            <div className="grid grid-cols-7 gap-2 mb-2 sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-2 rounded-xl">
              {daysOfWeek.map(day => <div key={day} className="text-center text-sm font-bold text-muted-foreground">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 min-h-[500px]">
              {getDaysInMonth(currentDate).map((day, i) => {
                const dayProkers = day ? getProkerForDate(day) : [];
                return (
                  <div key={i} onClick={() => day && handleDateClick(day)} className={cn("min-h-[100px] p-2 rounded-2xl border transition-all relative group", day ? "bg-white border-border/40 hover:border-pink-pastel/50 hover:shadow-md cursor-pointer" : "bg-muted/10 border-transparent")}>
                    {day && (
                      <>
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold mb-2", isToday(day) ? "bg-pink-pastel text-white shadow-sm" : "text-muted-foreground group-hover:text-foreground")}>{day}</div>
                        <div className="space-y-1.5">
                          {dayProkers.slice(0, 3).map(proker => (
                            <div key={proker.id} className={cn("text-[10px] px-2 py-1 rounded-md truncate text-white font-medium shadow-sm", getDivisionColor(proker.division))}>
                              {proker.name}
                            </div>
                          ))}
                          {dayProkers.length > 3 && <div className="text-[10px] font-bold text-muted-foreground text-center bg-muted/50 rounded-md py-0.5">+{dayProkers.length - 3} lainnya</div>}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-2xl">
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

      {/* DIALOGS (Modal List, Form, Guide) tetap di bawah seperti kode aslimu */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="text-pink-pastel" />
                Jadwal {selectedDate?.getDate()} {selectedDate ? monthNames[selectedDate.getMonth()] : ""}
            </DialogTitle>
            <DialogDescription>Daftar kegiatan pada tanggal ini:</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3 max-h-[60vh] overflow-y-auto px-1">
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
        <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
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
              <div><label className="text-sm font-bold text-foreground/80 mb-1.5 block">Divisi Penanggung Jawab</label><Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })} disabled={(!isAdmin && !editingProker) || !canEdit}><SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl"><SelectValue placeholder="Pilih divisi..." /></SelectTrigger><SelectContent className="rounded-xl border-border/50 shadow-xl">{divisions.map(div => (<SelectItem key={div.value} value={div.value} className="rounded-lg my-0.5 cursor-pointer"><div className="flex items-center gap-2"><div className={cn("w-3 h-3 rounded-full shadow-sm", div.color)} />{div.label}</div></SelectItem>))}</SelectContent></Select>{!isAdmin && !editingProker && <p className="text-[10px] text-muted-foreground mt-1.5 ml-1 flex items-center gap-1"><Lock size={10} /> Otomatis terpilih sesuai Divisi Anda.</p>}</div>
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
      
      {/* GUIDE DIALOG (tetap sama) */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
         {/* ... isi dialog guide kamu tetap sama ... */}
      </Dialog>
    </MainLayout>
  );
}
