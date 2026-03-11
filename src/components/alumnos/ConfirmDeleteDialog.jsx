import { Loader2, TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useEliminarUsuario } from "@/hooks/useUsuarios";

/**
 * Diálogo de confirmación para eliminar un alumno.
 * @param {{ open: boolean, onClose: () => void, alumno?: object }} props
 */
export default function ConfirmDeleteDialog({ open, onClose, alumno }) {
  const eliminar = useEliminarUsuario();

  const handleConfirm = () => {
    eliminar.mutate(alumno.id, {
      onSuccess: () => {
        onClose();
        eliminar.reset();
      },
    });
  };

  const handleClose = () => {
    if (!eliminar.isPending) { onClose(); eliminar.reset(); }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Eliminar alumno" size="sm">
      <div className="space-y-4">

        {/* Icono + mensaje */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              ¿Eliminar a{" "}
              <span className="font-bold capitalize">{alumno?.nombre}</span>?
            </p>
            <p className="text-xs text-muted-foreground">
              Esta acción no se puede deshacer. El alumno será eliminado
              permanentemente del sistema.
            </p>
          </div>
        </div>

        {/* Error de la mutación */}
        {eliminar.isError && (
          <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
            {eliminar.error?.message ?? "Error al eliminar"}
          </p>
        )}

        {/* Acciones */}
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
          >
            {eliminar.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}
