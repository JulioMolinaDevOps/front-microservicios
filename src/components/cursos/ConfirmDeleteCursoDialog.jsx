import { Loader2, TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useEliminarCurso } from "@/hooks/useCursos";

/**
 * Diálogo de confirmación para eliminar un curso.
 * @param {{ open: boolean, onClose: () => void, curso?: object }} props
 */
export default function ConfirmDeleteCursoDialog({ open, onClose, curso }) {
  const eliminar = useEliminarCurso();

  const handleConfirm = () => {
    eliminar.mutate(curso.id, {
      onSuccess: () => { onClose(); eliminar.reset(); },
    });
  };

  const handleClose = () => {
    if (!eliminar.isPending) { onClose(); eliminar.reset(); }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Eliminar curso" size="sm">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert size={18} color="#dc2626" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              ¿Eliminar el curso{" "}
              <span className="font-bold">"{curso?.nombre}"</span>?
            </p>
            <p className="text-xs text-muted-foreground">
              Esta acción no se puede deshacer. Se eliminarán también todas las
              relaciones con alumnos asociadas.
            </p>
          </div>
        </div>

        {eliminar.isError && (
          <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
            {eliminar.error?.message ?? "Error al eliminar"}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={eliminar.isPending}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={eliminar.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
          >
            {eliminar.isPending && <Loader2 size={14} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}
