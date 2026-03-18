import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Server,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/cursos", label: "Cursos", icon: BookOpen },
  { to: "/alumnos", label: "Alumnos", icon: Users },
];

// ── Sidebar interior ────────────────────────────────────────────────────────
function SidebarContent({ pathname, collapsed, onClose }) {
  return (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-white/10 px-4 gap-3 transition-all duration-300",
        collapsed ? "justify-center px-2" : "px-5"
      )}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Server className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-white tracking-tight truncate">
            MicroCursos
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "hover:bg-white/15 hover:text-white",
                active
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/65"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white" />
              )}
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                "group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer API info */}
      {!collapsed && (
        <div className="shrink-0 border-t border-white/10 p-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
            Servicios
          </p>
          <p className="text-xs text-white/50 truncate">
            <span className="text-white/30">Cursos  </span>
            {import.meta.env.VITE_CURSOS_API_URL}
          </p>
          <p className="text-xs text-white/50 truncate">
            <span className="text-white/30">Alumnos </span>
            {import.meta.env.VITE_USUARIOS_API_URL}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Layout principal ─────────────────────────────────────────────────────────
export default function MainLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  // Cerrar drawer al cambiar de ruta en mobile
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Cerrar drawer al hacer resize a desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const currentLabel = navItems.find((i) => i.to === pathname)?.label ?? "Dashboard";

  const sidebarClasses =
    "fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl transition-all duration-300 ease-in-out overflow-hidden";

  return (
    <div className="min-h-screen bg-background">

      {/* ── SIDEBAR DESKTOP ─────────────────────────────────────────────── */}
      <aside
        className={cn(sidebarClasses, "hidden lg:flex", collapsed ? "w-[72px]" : "w-64")}
      >
        <SidebarContent pathname={pathname} collapsed={collapsed} onClose={() => { }} />

        {/* Botón colapsar */}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className={cn(
            "absolute top-[4.25rem] -right-3.5 z-10",
            "flex h-7 w-7 items-center justify-center rounded-full",
            "bg-slate-700 border border-slate-600 text-white shadow-md",
            "hover:bg-slate-600 transition-colors duration-200"
          )}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* ── OVERLAY + DRAWER MOBILE ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          sidebarClasses, "lg:hidden w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Cerrar en mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent pathname={pathname} collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6 lg:px-8">
          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border hover:bg-accent transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">MicroCursos</span>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="font-medium">{currentLabel}</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Indicador de ambiente */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Desarrollo
          </span>
        </header>

        {/* Página */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
