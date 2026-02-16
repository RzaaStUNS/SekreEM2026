import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  FileText,
  FileBadge,
  PenTool,
  FileUp,
  FileDown,
  ClipboardCheck,
  Mail,
  File,
  List,
  MessageCircle,
  PackageOpen, // Import ikon kotak terbuka
} from "lucide-react";

// --- KOMPONEN KARTU DASHBOARD ---
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  iconBg: string;
  to?: string;
  external?: boolean;
}

const DashboardCard = ({ icon, title, iconBg, to, external }: DashboardCardProps) => {
  // Paksa icon jadi warna HITAM (text-foreground)
  // Saat hover berubah jadi Pink
  const styledIcon = React.cloneElement(icon as React.ReactElement, {
    className: "text-foreground group-hover:text-pink-pastel transition-colors duration-300",
    size: 28,
  });

  const content = (
    <div className="card-pastel p-6 cursor-pointer group hover:shadow-soft transition-all duration-300 border border-transparent hover:border-pink-pastel/20">
      <div
        className={cn(
          // Hapus background opacity, sekarang warnanya solid sesuai input 'iconBg'
          "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          iconBg
        )}
      >
        {styledIcon}
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-pink-pastel transition-colors">
        {title}
      </h3>
    </div>
  );

  if (external && to) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  if (to) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }

  return content;
};

// --- KOMPONEN SECTION WRAPPER ---
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-8 animate-fade-in">
    <div className="flex items-center gap-3 mb-4">
      <div className="section-indicator" />
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
      {children}
    </div>
  </div>
);

// --- HALAMAN UTAMA DASHBOARD ---
export default function Dashboard() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pb-10">

        {/* === General Info === */}
        <Section title="Informasi Umum">
          <DashboardCard
            icon={<Calendar />}
            title="Kalender Proker 2026"
            iconBg="bg-lavender" // Solid Lavender
            to="/calendar"
          />
          <DashboardCard
            icon={<FileText />}
            title="PPT Kenal Administrasi"
            iconBg="bg-soft-peach" // Solid Soft Peach
            to="/kenal-administrasi"
          />
          <DashboardCard
            icon={<FileBadge />}
            title="SOP Perizinan Proposal"
            iconBg="bg-pink-pastel" // Solid Pink Pastel
            to="/sop-perizinan"
          />
           {/* Update Ikon dan Link Inventarisasi */}
           <DashboardCard
            icon={<PackageOpen />} // Menggunakan ikon kotak terbuka
            title="Inventarisasi"
            iconBg="bg-pink-pastel" // Solid Pink Pastel
            to="https://invensekre.zaza.my.id/" // Hapus '/' di depan karena link external
            external // Tambahkan flag external agar terbuka di tab baru
          />
        </Section>

        {/* === Template Nyekre === */}
        <Section title="Seputar Template Nyekre">
          <DashboardCard
            icon={<PenTool />}
            title="Notulensi"
            iconBg="bg-pink-pastel"
            to="/template/notulensi"
          />
          <DashboardCard
            icon={<FileUp />}
            title="Proposal"
            iconBg="bg-soft-peach"
            to="/template/proposal"
          />
          <DashboardCard
            icon={<FileDown />}
            title="LPJ"
            iconBg="bg-baby-blue" // Solid Baby Blue
            to="/template/lpj"
          />
          <DashboardCard
            icon={<ClipboardCheck />}
            title="Presensi"
            iconBg="bg-pink-pastel"
            to="/template/presensi"
          />
          <DashboardCard
            icon={<Mail />}
            title="Persuratan"
            iconBg="bg-lavender"
            to="/template/persuratan"
          />
        </Section>

        {/* === Request Surat === */}
        <Section title="Permintaan Surat">
          <DashboardCard
            icon={<File />}
            title="SOP Request Surat"
            iconBg="bg-soft-peach"
            to="/sop-request"
          />
          <DashboardCard
            icon={<List />}
            title="Form Request"
            iconBg="bg-baby-blue"
            to="/form-request"
          />
        </Section>

        {/* === Contact Person === */}
        <Section title="Kontak Person WhatsApp">
          <DashboardCard
             icon={<MessageCircle />}
             title="Chat Abimanyu"
             iconBg="bg-whatsapp-pastel" // Solid Hijau WA Pastel
             to="https://wa.me/+6282133751840"
             external
          />
          <DashboardCard
             icon={<MessageCircle />}
             title="Obrolan Aldifa"
             iconBg="bg-whatsapp-pastel"
             to="https://wa.me/+6285720243561"
             external
          />
        </Section>

      </div>
    </MainLayout>
  );
}
