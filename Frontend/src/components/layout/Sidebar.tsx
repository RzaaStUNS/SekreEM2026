import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  File,
  FileDown,
  FileText,
  FileUp,
  FolderOpen,
  Info,
  LayoutDashboard,
  List,
  Mail,
  Menu,
  MessageCircle,
  PenTool,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: {
    icon: React.ReactNode;
    label: string;
    path: string;
    external?: boolean;
  }[];
}

// === PESAN WHATSAPP TEMPLATE ===
// Format: "Halo [Nama], aku mau tanya dong tentang..."
const msgAbimanyu = encodeURIComponent("Halo Abimanyu, aku mau tanya dong tentang (Pertanyaanmu) ");
const msgAldifa = encodeURIComponent("Halo Aldifa, aku mau tanya dong tentang (Pertanyaanmu) ");

const menuItems: MenuItem[] = [
  {
    icon: <User size={20} />,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Calendar size={20} />,
    label: "Kalender Proker Emailkomp",
    path: "/calendar",
  },
  {
    icon: <Info size={20} />,
    label: "Kenal Administrasi",
    path: "/kenal-administrasi",
  },
  {
    icon: <FileText size={20} />,
    label: "SOP Perizinan SV",
    path: "/sop-perizinan",
  },
  {
    icon: <FolderOpen size={20} />,
    label: "Template",
    children: [
      {
        icon: <PenTool size={18} />,
        label: "Notulensi",
        path: "/template/notulensi",
      },
      {
        icon: <FileUp size={18} />,
        label: "Proposal",
        path: "/template/proposal",
      },
      {
        icon: <FileDown size={18} />,
        label: "LPJ",
        path: "/template/lpj",
      },
      {
        icon: <ClipboardCheck size={18} />,
        label: "Presensi",
        path: "/template/presensi",
      },
      {
        icon: <Mail size={18} />,
        label: "Persuratan",
        path: "/template/persuratan",
      },
    ],
  },
  {
    icon: <File size={20} />,
    label: "Request Surat",
    children: [
      {
        icon: <File size={18} />,
        label: "SOP Request Surat",
        path: "/sop-request",
      },
      {
        icon: <List size={18} />,
        label: "Form Request",
        path: "/form-request",
      },
    ],
  },
  {
    icon: <MessageCircle size={20} />,
    label: "Contact Person",
    children: [
      {
        icon: <MessageCircle size={18} />,
        label: "Chat Abimanyu",
        // URL WA Langsung dengan Pesan
        path: `https://wa.me/6282133751840?text=${msgAbimanyu}`, 
        external: true,
      },
      {
        icon: <MessageCircle size={18} />,
        label: "Chat Aldifa",
        // URL WA Langsung dengan Pesan
        path: `https://wa.me/6285720243561?text=${msgAldifa}`, 
        external: true,
      },
    ],
  },
];

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "Request Surat",
    "Contact Person",
  ]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-gradient-sidebar transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 lg:w-20",
          "lg:relative"
        )}
      >
        <div
          className={cn("h-full flex flex-col", !isOpen && "lg:items-center")}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-sidebar-border/30">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-pastel flex items-center justify-center shadow-sm">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-foreground font-bold text-sm">
                    Sistem Sekre
                  </h1>
                  <p className="text-foreground/60 text-xs">
                    Sistem Administrasi
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-xl hover:bg-white/50 transition-colors text-foreground"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-pastel">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={cn(
                          "w-full menu-item justify-between",
                          !isOpen && "lg:justify-center lg:px-3"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {isOpen && (
                            <span className="text-sm">{item.label}</span>
                          )}
                        </div>
                        {isOpen && (
                          <span className="text-foreground/60">
                            {expandedMenus.includes(item.label) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </span>
                        )}
                      </button>
                      {isOpen && expandedMenus.includes(item.label) && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              {child.external ? (
                                <a
                                  href={child.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "menu-item text-sm",
                                    child.label.includes("Chat") &&
                                      "hover:bg-whatsapp-pastel/20"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      child.label.includes("Chat") &&
                                        "text-whatsapp"
                                    )}
                                  >
                                    {child.icon}
                                  </span>
                                  <span>{child.label}</span>
                                </a>
                              ) : (
                                <Link
                                  to={child.path}
                                  className={cn(
                                    "menu-item text-sm",
                                    isActive(child.path) && "active"
                                  )}
                                >
                                  {child.icon}
                                  <span className="text-sm">{child.label}</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path!}
                      className={cn(
                        "menu-item",
                        isActive(item.path) && "active",
                        !isOpen && "lg:justify-center lg:px-3"
                      )}
                    >
                      {item.icon}
                      {isOpen && <span className="text-sm">{item.label}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer - Settings */}
          <div className="p-3 border-t border-sidebar-border/30">
            <Link
              to="/settings"
              className={cn(
                "menu-item",
                isActive("/settings") && "active",
                !isOpen && "lg:justify-center lg:px-3"
              )}
            >
              <Settings size={20} />
              {isOpen && <span className="text-sm">Pengaturan</span>} 
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
