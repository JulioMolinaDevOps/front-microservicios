import { useState } from "react";
import { useCursos } from "@/hooks/useCursos";
import { BookOpen, Users, Hash, Plus, Pencil, Trash2 } from "lucide-react";
import CursoFormModal           from "@/components/cursos/CursoFormModal";
import CursoDetailModal         from "@/components/cursos/CursoDetailModal";
import ConfirmDeleteCursoDialog from "@/components/cursos/ConfirmDeleteCursoDialog";

// Paleta de colores por índice para las cards
const ACCENT_COLORS = [
  { bg: "#eff6ff", icon: "#2563eb", badgeBg: "#dbeafe", badgeText: "#1d4ed8", badgeBorder: "#bfdbfe" },
  { bg: "#f5f3ff", icon: "#7c3aed", badgeBg: "#ede9fe", badgeText: "#6d28d9", badgeBorder: "#ddd6fe" },
  { bg: "#ecfdf5", icon: "#059669", badgeBg: "#d1fae5", badgeText: "#065f46", badgeBorder: "#a7f3d0" },
  { bg: "#fff7ed", icon: "#ea580c", badgeBg: "#ffedd5", badgeText: "#c2410c", badgeBorder: "#fed7aa" },
  { bg: "#fff1f2", icon: "#e11d48", badgeBg: "#ffe4e6", badgeText: "#be123c", badgeBorder: "#fecdd3" },
  { bg: "#ecfeff", icon: "#0891b2", badgeBg: "#cffafe", badgeText: "#0e7490", badgeBorder: "#a5f3fc" },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="flex gap-2">
        <div className="h-6 bg-muted rounded-full w-24" />
      </div>
    </div>
  );
}

function CursoCard({ curso, index, onView, onEdit, onDelete }) {
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const totalAlumnos = curso.cursosalumnos?.length ?? 0;

  return (
    <div
      className="animate-fade-in-up group rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer relative"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onView(curso)}
    >
      {/* Barra superior de color */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${color.icon}99, ${color.icon}33)` }} />

      {/* Botones de acción en hover */}
      <div
        className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(curso)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-all hover:scale-110"
          style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
          title="Editar"
        >
          <Pencil size={13} color="#2563eb" strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(curso)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-all hover:scale-110"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
          title="Eliminar"
        >
          <Trash2 size={13} color="#dc2626" strokeWidth={2} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Icono + nombre */}
        <div className="flex items-start gap-4 pr-16">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: color.bg }}
          >
            <BookOpen size={20} color={color.icon} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate" title={curso.nombre}>
              {curso.nombre}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Hash size={11} />
              ID: {curso.id}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Badge de alumnos */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
            style={{ backgroundColor: color.badgeBg, color: color.badgeText, ringColor: color.badgeBorder }}
          >
            <Users size={11} color={color.badgeText} />
            {totalAlumnos === 0
              ? "Sin alumnos"
              : `${totalAlumnos} alumno${totalAlumnos !== 1 ? "s" : ""}`}
          </span>
          {totalAlumnos === 0 && (
            <span className="text-xs text-muted-foreground italic">Disponible</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CursosPage() {
  const { data: cursos, isLoading, isError, error } = useCursos();

  const [selected, setSelected] = useState(null);
  const [modal, setModal]       = useState(null); // "detail" | "form" | "delete"

  const openDetail = (curso) => { setSelected(curso); setModal("detail"); };
  const openEdit   = (curso) => { setSelected(curso); setModal("form"); };
  const openDelete = (curso) => { setSelected(curso); setModal("delete"); };
  const openCreate = ()      => { setSelected(null);  setModal("form"); };
  const closeModal = ()      => { setModal(null); };

  return (
    <div className="space-y-6">

      {/* Encabezado */}
      <div className="animate-fade-in flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground mt-1">
              {cursos?.length ?? 0} curso{cursos?.length !== 1 ? "s" : ""} registrado{cursos?.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 shadow-sm hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#1e293b", color: "#fff" }}
        >
          <Plus size={16} color="#fff" />
          Nuevo curso
        </button>
      </div>

      {/* Estado de error */}
      {isError && (
        <div className="animate-fade-in rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">Error al cargar los cursos</p>
          <p className="text-sm text-muted-foreground mt-1">{error?.message}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : cursos?.map((curso, i) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                index={i}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
      </div>

      {/* Estado vacío */}
      {!isLoading && !isError && cursos?.length === 0 && (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="font-medium text-muted-foreground">No hay cursos registrados</p>
          <button onClick={openCreate} className="mt-3 text-sm hover:underline" style={{ color: "#2563eb" }}>
            Crear el primero
          </button>
        </div>
      )}

      {/* ── Modales ── */}
      <CursoDetailModal
        open={modal === "detail"}
        onClose={closeModal}
        curso={selected}
      />
      <CursoFormModal
        open={modal === "form"}
        onClose={closeModal}
        curso={selected}
      />
      <ConfirmDeleteCursoDialog
        open={modal === "delete"}
        onClose={closeModal}
        curso={selected}
      />
    </div>
  );
}
