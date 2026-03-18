import { Mail, Hash, KeyRound, User } from "lucide-react";
import Modal from "@/components/ui/Modal";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-orange-500", "bg-rose-500", "bg-cyan-500",
  "bg-amber-500", "bg-pink-500", "bg-indigo-500",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">

        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/**
 * Modal de detalle de un alumno (solo lectura).
 * @param {{ open: boolean, onClose: () => void, alumno?: object }} props
 */
export default function AlumnoDetailModal({ open, onClose, alumno }) {
  if (!alumno) return null;

  const avatarColor = getAvatarColor(alumno.nombre);
  const initials = getInitials(alumno.nombre);

  return (
    <Modal open={open} onClose={onClose} title="Detalle del alumno" size="sm">
      <div className="space-y-4">

        {/* Avatar + nombre */}
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white font-bold text-xl select-none ${avatarColor}`}>
            {initials || "?"}
          </div>
          <div>
            <p className="text-lg font-bold capitalize">{alumno.nombre}</p>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              <Hash className="h-3 w-3" /> ID {alumno.id}
            </span>
          </div>
        </div>

        <div className="divide-y rounded-xl border px-4">
          <DetailRow icon={User} label="Nombre" value={alumno.nombre} />
          <DetailRow icon={Mail} label="Correo" value={alumno.correo} />
          <DetailRow icon={KeyRound} label="Contraseña" value={alumno.contrasena ?? "—"} />
        </div>
      </div>
    </Modal>
  );
}
