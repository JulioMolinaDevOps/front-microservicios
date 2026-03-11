import { useState, useRef, useEffect } from "react";
import { Loader2, Hash, Users, UserPlus, X, BookOpen, Search, CheckCircle2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useCurso, useAsignarAlumno, useQuitarAlumno } from "@/hooks/useCursos";
import { useUsuarios } from "@/hooks/useUsuarios";

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#3b82f6","#8b5cf6","#10b981","#f97316",
  "#f43f5e","#06b6d4","#f59e0b","#ec4899","#6366f1",
];
function avatarColor(id = 0) {
  return AVATAR_COLORS[Math.abs(id) % AVATAR_COLORS.length];
}
function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

// ── Fila de alumno asignado ──────────────────────────────────────────────────
function AlumnoRow({ alumno, cursoId, onQuitar, isPendingQuitar }) {
  const bg = avatarColor(alumno.id);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-semibold"
        style={{ backgroundColor: bg }}
      >
        {initials(alumno.nombre)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize truncate">{alumno.nombre}</p>
        <p className="text-xs text-muted-foreground truncate">{alumno.correo}</p>
      </div>
      <button
        onClick={() => onQuitar({ cursoId, alumno: { id: alumno.id } })}
        disabled={isPendingQuitar}
        className="flex h-7 w-7 items-center justify-center rounded-lg border transition-all hover:scale-110 shrink-0"
        style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
        title="Quitar del curso"
      >
        <X size={13} color="#dc2626" strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Buscador de alumnos con autocomplete ─────────────────────────────────────
function AlumnoBuscador({ cursosAlumnosIds, cursoId, onAsignar, isPending, error }) {
  const [query, setQuery]           = useState("");
  const [open, setOpen]             = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef(null);
  const listRef  = useRef(null);

  const { data: todosAlumnos = [], isLoading: loadingAlumnos } = useUsuarios();

  // Filtrar: que coincida con el query y no esté ya asignado
  const sugerencias = query.trim().length === 0 ? [] : todosAlumnos.filter((a) => {
    const yaAsignado = cursosAlumnosIds.includes(a.id);
    const coincide   = a.nombre.toLowerCase().includes(query.toLowerCase()) ||
                       a.correo.toLowerCase().includes(query.toLowerCase());
    return !yaAsignado && coincide;
  }).slice(0, 6);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest("[data-buscador]")?.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const seleccionar = (alumno) => {
    onAsignar(alumno);
    setQuery("");
    setOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (e) => {
    if (!open || sugerencias.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((p) => Math.min(p + 1, sugerencias.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      seleccionar(sugerencias[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div data-buscador className="space-y-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <UserPlus size={15} />
        Asignar alumno existente
      </p>

      {/* Input con icono */}
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {loadingAlumnos
            ? <Loader2 size={14} className="animate-spin text-muted-foreground" />
            : <Search size={14} className="text-muted-foreground" />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar alumno por nombre o correo…"
          className="w-full rounded-lg border border-input pl-9 pr-4 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
        />

        {/* Dropdown de sugerencias */}
        {open && query.trim().length > 0 && (
          <div
            ref={listRef}
            className="absolute z-50 mt-1 w-full rounded-xl border bg-background shadow-lg overflow-hidden"
          >
            {sugerencias.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                {loadingAlumnos ? "Cargando…" : "Sin coincidencias"}
              </div>
            ) : (
              <ul>
                {sugerencias.map((alumno, i) => {
                  const bg = avatarColor(alumno.id);
                  const isHighlighted = i === highlighted;
                  return (
                    <li
                      key={alumno.id}
                      onMouseDown={() => seleccionar(alumno)}
                      onMouseEnter={() => setHighlighted(i)}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b last:border-0"
                      style={{ backgroundColor: isHighlighted ? "#f1f5f9" : "transparent" }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: bg }}
                      >
                        {initials(alumno.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize truncate">{alumno.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{alumno.correo}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">ID {alumno.id}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Feedback de acción */}
      {isPending && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" /> Asignando…
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error?.message ?? "Error al asignar"}</p>
      )}
    </div>
  );
}

// ── Modal de detalle ─────────────────────────────────────────────────────────
export default function CursoDetailModal({ open, onClose, curso }) {
  const { data: cursoDetalle, isLoading } = useCurso(curso?.id, { enabled: open && !!curso?.id });
  const asignar = useAsignarAlumno();
  const quitar  = useQuitarAlumno();

  const alumnos          = cursoDetalle?.alumnos ?? [];
  const totalRelaciones  = cursoDetalle?.cursosalumnos?.length ?? curso?.cursosalumnos?.length ?? 0;
  // IDs ya asignados para excluirlos del buscador
  const asignadosIds     = cursoDetalle?.cursosalumnos?.map((ca) => ca.alumno_id) ?? [];

  const handleAsignar = (alumno) => {
    asignar.mutate(
      { cursoId: curso.id, alumno: { id: alumno.id } },
      { onSuccess: () => asignar.reset() }
    );
  };

  const handleQuitar = ({ cursoId, alumno }) => {
    quitar.mutate({ cursoId, alumno }, { onSuccess: () => quitar.reset() });
  };

  if (!curso) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle del curso" size="md">
      <div className="space-y-5">

        {/* Info del curso */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#eff6ff" }}>
            <BookOpen size={24} color="#2563eb" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{curso.nombre}</h3>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              <Hash size={11} /> ID {curso.id}
            </span>
          </div>
        </div>

        {/* Buscador */}
        <div className="rounded-xl border p-4">
          <AlumnoBuscador
            cursosAlumnosIds={asignadosIds}
            cursoId={curso.id}
            onAsignar={handleAsignar}
            isPending={asignar.isPending}
            error={asignar.isError ? asignar.error : null}
          />
          {quitar.isError && (
            <p className="text-xs text-destructive mt-2">{quitar.error?.message ?? "Error al quitar"}</p>
          )}
        </div>

        {/* Lista de alumnos inscritos */}
        <div className="space-y-2">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Users size={15} />
            Alumnos inscritos
            <span
              className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "#1e293b" }}
            >
              {totalRelaciones}
            </span>
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : alumnos.length === 0 ? (
            <div className="rounded-xl border border-dashed py-8 text-center">
              <Users size={28} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Sin alumnos inscritos</p>
            </div>
          ) : (
            <div className="rounded-xl border px-4">
              {alumnos.map((alumno) => (
                <AlumnoRow
                  key={alumno.id}
                  alumno={alumno}
                  cursoId={curso.id}
                  onQuitar={handleQuitar}
                  isPendingQuitar={quitar.isPending}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}


