import { useState } from "react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { Mail, Hash, Users, Plus, Pencil, Trash2 } from "lucide-react";
import AlumnoFormModal    from "@/components/alumnos/AlumnoFormModal";
import AlumnoDetailModal  from "@/components/alumnos/AlumnoDetailModal";
import ConfirmDeleteDialog from "@/components/alumnos/ConfirmDeleteDialog";

// Genera un color de avatar determinista a partir del nombre
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-center gap-4 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

function AlumnoCard({ alumno, index, onView, onEdit, onDelete }) {
  const avatarColor = getAvatarColor(alumno.nombre);
  const initials = getInitials(alumno.nombre);

  return (
    <div
      className="animate-fade-in-up group rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-5 flex items-center gap-4 cursor-pointer relative"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onView(alumno)}
    >
      {/* Acciones flotantes en hover */}
      <div
        className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(alumno)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-all hover:scale-110"
          style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
          title="Editar"
        >
          <Pencil size={14} color="#2563eb" strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(alumno)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-all hover:scale-110"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
          title="Eliminar"
        >
          <Trash2 size={14} color="#dc2626" strokeWidth={2} />
        </button>
      </div>

      {/* Avatar con iniciales */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-semibold text-sm select-none ${avatarColor} transition-transform duration-300 group-hover:scale-110`}
      >
        {initials || "?"}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-1 pr-12">
        <p className="font-semibold text-sm leading-tight truncate capitalize" title={alumno.nombre}>
          {alumno.nombre}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate" title={alumno.correo}>
          <Mail className="h-3 w-3 shrink-0" />
          {alumno.correo}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Hash className="h-3 w-3" />
          ID: {alumno.id}
        </p>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const { data: usuarios, isLoading, isError, error } = useUsuarios();

  // Estado de modales
  const [selected, setSelected]   = useState(null);
  const [modal, setModal]         = useState(null); // "detail" | "form" | "delete"

  const openDetail = (alumno) => { setSelected(alumno); setModal("detail"); };
  const openEdit   = (alumno) => { setSelected(alumno); setModal("form"); };
  const openDelete = (alumno) => { setSelected(alumno); setModal("delete"); };
  const openCreate = ()       => { setSelected(null);   setModal("form"); };
  const closeModal = ()       => { setModal(null); };

  return (
    <div className="space-y-6">

      {/* Encabezado */}
      <div className="animate-fade-in flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground mt-1">
              {usuarios?.length ?? 0} alumno{usuarios?.length !== 1 ? "s" : ""} registrado{usuarios?.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 shadow-sm hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#1e293b", color: "#fff" }}
        >
          <Plus className="h-4 w-4" />
          Nuevo alumno
        </button>
      </div>

      {/* Estado de error */}
      {isError && (
        <div className="animate-fade-in rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">Error al cargar los alumnos</p>
          <p className="text-sm text-muted-foreground mt-1">{error?.message}</p>
        </div>
      )}

      {/* Grid de cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : usuarios?.map((alumno, i) => (
              <AlumnoCard
                key={alumno.id}
                alumno={alumno}
                index={i}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
      </div>

      {/* Estado vacío */}
      {!isLoading && !isError && usuarios?.length === 0 && (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="font-medium text-muted-foreground">No hay alumnos registrados</p>
          <button onClick={openCreate} className="mt-3 text-sm text-primary hover:underline">
            Agregar el primero
          </button>
        </div>
      )}

      {/* ── Modales ─────────────────────────────────────── */}
      <AlumnoDetailModal
        open={modal === "detail"}
        onClose={closeModal}
        alumno={selected}
      />
      <AlumnoFormModal
        open={modal === "form"}
        onClose={closeModal}
        alumno={selected}
      />
      <ConfirmDeleteDialog
        open={modal === "delete"}
        onClose={closeModal}
        alumno={selected}
      />
    </div>
  );
}
