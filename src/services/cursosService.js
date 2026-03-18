import cursosClient from "@/api/cursosClient";

/**
 * Service para el microservicio de Cursos (puerto 8082)
 * Imagen: juliomoli/mscv-cursos:v1
 *
 * Endpoints del ControllerCurso (sin @RequestMapping de clase):
 *  GET    /                        → listarCursos
 *  GET    /{id}                    → listarPorId  (incluye alumnos del curso)
 *  POST   /                        → guardarCurso  { nombre }
 *  PUT    /{id}                    → editarCurso   { nombre }
 *  DELETE /{id}                    → eliminarCurso
 *  PUT    /asignaralumno/{cursoid} → asignarAlumnoCurso   body: { id }
 *  POST   /crearalumno/{cursoid}   → crearalumnocurso     body: { nombre, correo, contrasena }
 *  DELETE /quitar-alumno/{cursoid} → quitarAlumnoCurso    body: { id }
 *  DELETE /eliminarcursoalumno/{id}→ eliminarcursoalumno
 */

export const cursosService = {
  // ── CRUD Cursos ──────────────────────────────────────────────────────────────

  /**
   * GET / → lista todos los cursos (sin alumnos)
   * @returns {Promise<Cursos[]>}
   */
  getAll: () => cursosClient.get("/").then(res => res.data),

  /**
   * GET /{id} → obtiene el curso con sus alumnos populados
   * @param {number} id
   * @returns {Promise<Cursos>} curso con campo alumnos[]
   */
  getById: (id) => cursosClient.get(`/${id}`).then((res) => res.data),

  /**
   * POST / → crea un nuevo curso
   * @param {{ nombre: string }} data
   * @returns {Promise<Cursos>}
   */
  create: (data) => cursosClient.post("/", data).then((res) => res.data),

  /**
   * PUT /{id} → actualiza el nombre de un curso
   * @param {number} id
   * @param {{ nombre: string }} data
   * @returns {Promise<Cursos>}
   */
  update: (id, data) =>
    cursosClient.put(`/${id}`, data).then((res) => res.data),

  /**
   * DELETE /{id} → elimina un curso
   * @param {number} id
   * @returns {Promise<void>}
   */
  remove: (id) => cursosClient.delete(`/${id}`).then((res) => res.data),

  // ── Relación Curso ↔ Alumno ──────────────────────────────────────────────────

  /**
   * PUT /asignaralumno/{cursoid}
   * Asigna un alumno existente a un curso (el alumno debe existir en el msvc-alumnos).
   * @param {number} cursoId
   * @param {{ id: number }} alumno - solo se necesita el id del alumno
   * @returns {Promise<Alumno>}
   */
  asignarAlumno: (cursoId, alumno) =>
    cursosClient
      .put(`/asignaralumno/${cursoId}`, alumno)
      .then((res) => res.data),

  /**
   * POST /crearalumno/{cursoid}
   * Crea un alumno nuevo en msvc-alumnos y lo asigna al curso.
   * @param {number} cursoId
   * @param {{ nombre: string, correo: string, contrasena: string }} alumno
   * @returns {Promise<Alumno>}
   */
  crearAlumnoEnCurso: (cursoId, alumno) =>
    cursosClient
      .post(`/crearalumno/${cursoId}`, alumno)
      .then((res) => res.data),

  /**
   * DELETE /quitar-alumno/{cursoid}
   * Quita (desvincula) un alumno de un curso sin eliminarlo del msvc-alumnos.
   * @param {number} cursoId
   * @param {{ id: number }} alumno - solo se necesita el id del alumno
   * @returns {Promise<Alumno>}
   */
  quitarAlumno: (cursoId, alumno) =>
    cursosClient
      .delete(`/quitar-alumno/${cursoId}`, { data: alumno })
      .then((res) => res.data),

  /**
   * DELETE /eliminarcursoalumno/{id}
   * Elimina el registro CursoAlumno por su propio id (usado internamente al
   * eliminar un alumno desde msvc-alumnos para limpiar las relaciones).
   * @param {number} id - id del registro CursoAlumno
   * @returns {Promise<void>}
   */
  eliminarCursoAlumno: (id) =>
    cursosClient.delete(`/eliminarcursoalumno/${id}`).then((res) => res.data),

  // ── Alias mantenido por compatibilidad ──────────────────────────────────────
  /**
   * @deprecated usar quitarAlumno
   * @param {number} cursoId
   * @param {{ id: number }} alumno
   */
  eliminarAlumno: (cursoId, alumno) =>
    cursosClient
      .delete(`/quitar-alumno/${cursoId}`, { data: alumno })
      .then((res) => res.data),
};