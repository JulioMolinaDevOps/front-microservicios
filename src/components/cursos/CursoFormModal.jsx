import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, BookOpen } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useCrearCurso, useActualizarCurso } from "@/hooks/useCursos";

function Input({ hasError, ...props }) {
  return (
    <input
      className={[
        "w-full rounded-lg border px-3 py-2 text-sm bg-background",
        "outline-none transition-all duration-200 placeholder:text-muted-foreground",
        "focus:ring-2 focus:ring-ring focus:border-transparent",
        hasError ? "border-destructive" : "border-input",
      ].join(" ")}
      {...props}
    />
  );
}

/**
 * Modal para crear o editar un curso.
 * @param {{ open: boolean, onClose: () => void, curso?: object }} props
 */
export default function CursoFormModal({ open, onClose, curso }) {
  const isEditing = !!curso;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { nombre: curso?.nombre ?? "" } });

  useEffect(() => {
    reset({ nombre: curso?.nombre ?? "" });
  }, [curso, reset, open]);

  const crear      = useCrearCurso();
  const actualizar = useActualizarCurso();
  const isPending  = crear.isPending || actualizar.isPending;

  const onSubmit = (data) => {
    if (isEditing) {
      actualizar.mutate(
        { id: curso.id, data },
        { onSuccess: () => { onClose(); reset(); } }
      );
    } else {
      crear.mutate(data, { onSuccess: () => { onClose(); reset(); } });
    }
  };

  const handleClose = () => { if (!isPending) { onClose(); reset(); } };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? "Editar curso" : "Nuevo curso"}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <BookOpen size={14} className="text-muted-foreground" />
            Nombre del curso
          </label>
          <Input
            hasError={!!errors.nombre}
            placeholder="ej. Docker, Kubernetes…"
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.nombre && (
            <p className="text-xs text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        {/* Error de mutación */}
        {(crear.isError || actualizar.isError) && (
          <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
            {crear.error?.message ?? actualizar.error?.message ?? "Error al guardar"}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1e293b", color: "#fff" }}
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear curso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
