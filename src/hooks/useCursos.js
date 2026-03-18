import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cursosService } from "@/services/cursosService";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const cursosKeys = {
  all: ["cursos"],
  lists: () => [...cursosKeys.all, "list"],
  list: (filters) => [...cursosKeys.lists(), { filters }],
  details: () => [...cursosKeys.all, "detail"],
  detail: (id) => [...cursosKeys.details(), id],
};

// ─── Queries ───────────────────────────────────────────────────────────────────

/**
 * GET / → lista todos los cursos (sin alumnos populados)
 */
export function useCursos(options = {}) {
  return useQuery({
    queryKey: cursosKeys.lists(),
    queryFn: cursosService.getAll,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * GET /{id} → obtiene el curso con sus alumnos populados
 * @param {number} id
 */
export function useCurso(id, options = {}) {
  return useQuery({
    queryKey: cursosKeys.detail(id),
    queryFn: () => cursosService.getById(id),
    enabled: !!id,
    ...options,
  });
}

// ─── Mutations CRUD ────────────────────────────────────────────────────────────

/**
 * POST / → crea un nuevo curso
 * body: { nombre: string }
 */
export function useCrearCurso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cursosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.lists() });
    },
  });
}

/**
 * PUT /{id} → actualiza el nombre de un curso
 * body: { nombre: string }
 */
export function useActualizarCurso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => cursosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cursosKeys.lists() });
    },
  });
}

/**
 * DELETE /{id} → elimina un curso
 */
export function useEliminarCurso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cursosService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.lists() });
    },
  });
}

// ─── Mutations relación Curso ↔ Alumno ─────────────────────────────────────────

/**
 * PUT /asignaralumno/{cursoid}
 * Asigna un alumno ya existente en msvc-alumnos a un curso.
 * @param {{ cursoId: number, alumno: { id: number } }} vars
 * @returns { Alumno } alumno asignado
 */
export function useAsignarAlumno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cursoId, alumno }) =>
      cursosService.asignarAlumno(cursoId, alumno),
    onSuccess: (_, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.detail(cursoId) });
    },
  });
}

/**
 * POST /crearalumno/{cursoid}
 * Crea un alumno nuevo en msvc-alumnos y lo asigna al curso en un solo paso.
 * @param {{ cursoId: number, alumno: { nombre, correo, contrasena } }} vars
 * @returns { Alumno } alumno creado y asignado
 */
export function useCrearAlumnoEnCurso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cursoId, alumno }) =>
      cursosService.crearAlumnoEnCurso(cursoId, alumno),
    onSuccess: (_, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.detail(cursoId) });
    },
  });
}

/**
 * DELETE /quitar-alumno/{cursoid}
 * Quita (desvincula) un alumno del curso sin eliminarlo de msvc-alumnos.
 * @param {{ cursoId: number, alumno: { id: number } }} vars
 * @returns { Alumno } alumno desvinculado
 */
export function useQuitarAlumno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cursoId, alumno }) =>
      cursosService.quitarAlumno(cursoId, alumno),
    onSuccess: (_, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.detail(cursoId) });
    },
  });
}

/**
 * DELETE /eliminarcursoalumno/{id}
 * Elimina el registro CursoAlumno por su id interno.
 * Usado por msvc-alumnos al borrar un alumno para limpiar relaciones.
 * @param {number} id - id del registro CursoAlumno
 */
export function useEliminarCursoAlumno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cursosService.eliminarCursoAlumno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.all });
    },
  });
}

// ─── Alias de compatibilidad ───────────────────────────────────────────────────
/** @deprecated usar useQuitarAlumno */
export const useEliminarAlumnoDeCurso = useQuitarAlumno;