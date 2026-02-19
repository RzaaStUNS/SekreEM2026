import { MainLayout } from "@/components/layout/MainLayout";
import { FolderOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const templateData: Record<string, { title: string; description: string; link: string }> = {
  notulensi: {
    title: "Template Notulensi",
    description: "Template notulensi rapat organisasi",
    link: "https://drive.google.com/drive/folders/1maI41dzuvG57LRhscGHKox6_ZuiC9yEe",
  },
  proposal: {
    title: "Template Proposal",
    description: "Template proposal kegiatan",
    link: "https://drive.google.com/drive/folders/1GjVfXBOe1FfC386of3uE9TxPKvhiMLEN",
  },
  lpj: {
    title: "Template LPJ",
    description: "Template Laporan Pertanggungjawaban",
    link: "https://drive.google.com/drive/folders/1mzCMgWFHGQvbf7fylzoNn-KYtCqWewYT",
  },
  presensi: {
    title: "Template Presensi",
    description: "Template daftar hadir kegiatan",
    link: "https://drive.google.com/drive/folders/1ETXnpPUC24SFByfd1ihi7Ct1l5_5j1p4",
  },
  persuratan: {
    title: "Template Persuratan",
    description: "Template surat-menyurat organisasi",
    link: "https://drive.google.com/drive/folders/1MuNlsZ3y30lzK-UoclyJGUZz8p4cZxuE",
  },
  ARK: {
    title: "Template ARK",
    description: "Template Analisis Resiko Kegiatan",
    link: "https://docs.google.com/document/d/1Q7pP-WHcQO390wJc3wXsZ231qpFfXaP_/edit?usp=sharing&ouid=117447629839833109359&rtpof=true&sd=true",
  },
};

export default function TemplatePage() {
  const { type } = useParams();
  const template = templateData[type || "notulensi"];

  if (!template) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Template tidak ditemukan</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Card */}
        <div className="card-pastel overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-lavender/30 to-baby-blue/30 p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-baby-blue/40 rounded-2xl flex items-center justify-center">
              <FolderOpen size={28} className="text-baby-blue" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{template.title}</h1>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Klik tombol di bawah untuk membuka folder Google Drive yang berisi template {template.title.replace("Template ", "")}.
              </p>
              <p className="text-xs text-muted-foreground/70 break-all">
                {template.link}
              </p>
            </div>

            <Button
              asChild
              className="w-full h-14 bg-lavender hover:bg-lavender/90 text-foreground font-semibold rounded-2xl"
            >
              <a href={template.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <FolderOpen size={20} />
                Buka di Google Drive
                <ExternalLink size={18} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
