import { MainLayout } from "@/components/layout/MainLayout";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormRequest() {
  const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSfiDdNpbyVtwj4YgnohzCybEbwHxZ-GxYnHoG7jGSHrvbZGAA/viewform";

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-pastel mb-2 flex items-center justify-center gap-3">
            Form Request Surat
            <span className="text-2xl">📝</span>
          </h1>
          <p className="text-muted-foreground">
            Isi form berikut untuk mengajukan request surat
          </p>
        </div>

        {/* Card */}
        <div className="card-pastel overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-baby-blue/30 to-lavender/30 p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-baby-blue/40 rounded-2xl flex items-center justify-center">
              <FileText size={28} className="text-baby-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Form Request Surat</h2>
              <p className="text-sm text-muted-foreground">Google Form pengajuan surat</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                Klik tombol di bawah untuk membuka Google Form dan mengisi request surat. 
                Pastikan data yang diisi sudah benar sebelum submit.
              </p>
              <div className="flex items-start gap-2 text-xs text-muted-foreground/70">
                <span className="text-pink-pastel">💡</span>
                <p>Setelah mengisi form, jangan lupa konfirmasi ke Contact Person menggunakan template chat yang tersedia.</p>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-14 bg-gradient-to-r from-baby-blue to-pink-pastel hover:opacity-90 text-white font-semibold rounded-2xl shadow-button"
            >
              <a href={formLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <FileText size={20} />
                Buka Form Request
                <ExternalLink size={18} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
