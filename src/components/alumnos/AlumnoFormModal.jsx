import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { useCrearUsuario, useActualizarUsuario } from "@/hooks/useUsuarios";

// ── Componente de campo reutilizable ─────────────────────────────────────────
function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// ── Input base ───────────────────────────────────────────────────────────────
function Input({ className, hasError, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-sm bg-background",
        "outline-none ring-offset-background transition-all duration-200",
        "placeholder:text-muted-foreground",
        "focus:ring-2 focus:ring-ring focus:border-transparent",
        hasError
          ? "border-destructive focus:ring-destructive/30"
          : "border-input",
        className
      )}
      {...props}
    />
  );
}

// ── Modal de formulario ──────────────────────────────────────────────────────
/**
 * @param {{ open: boolean, onClose: () => void, alumno?: object }} props
 * alumno → modo edición; undefined → modo creación
 */
export default function AlumnoFormModal({ open, onClose, alumno }) {
  const isEditing = !!alumno;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      nombre:    alumno?.nombre    ?? "",
      correo:    alumno?.correo    ?? "",
      contrasena: alumno?.contrasena ?? "",
    },
  });

  // Sincronizar valores cuando cambia el alumno (al abrir en modo edición)
  useEffect(() => {
    reset({
      nombre:    alumno?.nombre    ?? "",
      correo:    alumno?.correo    ?? "",
      contrasena: alumno?.contrasena ?? "",
    });
  }, [alumno, reset, open]);

  const crear     = useCrearUsuario();
  const actualizar = useActualizarUsuario();
  const isPending = crear.isPending || actualizar.isPending;

  const onSubmit = (data) => {
    if (isEditing) {
      actualizar.mutate(
        { id: alumno.id, data },
        { onSuccess: () => { onClose(); reset(); } }
      );
    } else {
      crear.mutate(data, {
        onSuccess: () => { onClose(); reset(); },
      });
    }
  };

  const handleClose = () => {
    if (!isPending) { onClose(); reset(); }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? "Editar alumno" : "Nuevo alumno"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* Nombre */}
        <Field label="Nombre" icon={User} error={errors.nombre?.message}>
          <Input
            hasError={!!errors.nombre}
            placeholder="ej. valentina"
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
        </Field>

        {/* Correo */}
        <Field label="Correo electrónico" icon={Mail} error={errors.correo?.message}>
          <Input
            type="email"
            hasError={!!errors.correo}
            placeholder="ej. valentina@gmail.com"
            {...register("correo", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
          />
        </Field>

        {/* Contraseña */}
        <Field label="Contraseña" icon={Lock} error={errors.contrasena?.message}>
          <Input
            type="password"
            hasError={!!errors.contrasena}
            placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña"}
            {...register("contrasena", {
              required: isEditing ? false : "La contraseña es obligatoria",
              minLength: isEditing
                ? undefined
                : { value: 4, message: "Mínimo 4 caracteres" },
            })}
          />
        </Field>

        {/* Error global de la mutación */}
        {(crear.isError || actualizar.isError) && (
          <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
            {crear.error?.message ?? actualizar.error?.message ?? "Error al guardar"}
          </p>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || (isEditing && !isDirty)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1e293b", color: "#fff" }}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear alumno"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
