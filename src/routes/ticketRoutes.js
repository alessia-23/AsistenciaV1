import express from "express";
import {crearTicket,obtenerTickets,buscarTicket,actualizarTicket,eliminarTicket,obtenerTicketPorId} from "../controllers/ticketController.js";
import protegerRuta from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/crear", protegerRuta, crearTicket);
router.get("/listar", protegerRuta, obtenerTickets);
router.get("/buscar", protegerRuta, buscarTicket);
router.get("/buscarid/:id", protegerRuta, obtenerTicketPorId);
router.put("/actualizar/:id", protegerRuta, actualizarTicket);
router.delete("/eliminar/:id", protegerRuta, eliminarTicket);

export default router;