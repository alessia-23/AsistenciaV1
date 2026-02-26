import express from "express";
import {crearTecnico,obtenerTecnicos,buscarTecnico,actualizarTecnico,eliminarTecnico,obtenerTecnicoPorId} from "../controllers/tecnicoController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/crear", protegerRuta, crearTecnico);
router.get("/listar", protegerRuta, obtenerTecnicos);
router.get("/buscar", protegerRuta, buscarTecnico);
router.get("/buscarid/:id",protegerRuta,obtenerTecnicoPorId)
router.put("/actualizar/:id", protegerRuta, actualizarTecnico);
router.delete("/eliminar/:id", protegerRuta, eliminarTecnico);

export default router;