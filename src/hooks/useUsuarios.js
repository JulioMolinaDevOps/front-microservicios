import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosService } from "@/services/usuariosService";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const usuariosKeys = {
  all: ["usuarios"],
  lists: () => [...usuariosKeys.all, "list"],
  list: (filters) => [...usuariosKeys.lists(), { filters }],
  details: () => [...usuariosKeys.all, "detail"],
  detail: (id) => [...usuariosKeys.details(), id],
};

// ─── Queries ───────────────────────────────────────────────────────────────────

/**
 * Hook para obtener todos los alumnos/usuarios
 */
export function useUsuarios(options = {}) {
  return useQuery({
    queryKey: usuariosKeys.lists(),
    queryFn: usuariosService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos
    ...options,
  });
}

/**
 * Hook para obtener un alumno/usuario por ID
 * @param {number|string} id
 */
export function useUsuario(id, options = {}) {
  return useQuery({
    queryKey: usuariosKeys.detail(id),
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
    ...options,
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Hook para crear un alumno/usuario
 */
export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuariosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
    },
  });
}

/**
 * Hook para actualizar un alumno/usuario
 */
export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usuariosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
    },
  });
}

/**
 * Hook para eliminar un alumno/usuario
 */
export function useEliminarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuariosService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
    },
  });
}
