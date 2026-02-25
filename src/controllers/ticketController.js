import Ticket from "../models/Ticket.js";
import Cliente from "../models/Cliente.js";
import Tecnico from "../models/Tecnico.js";
import mongoose from "mongoose";

// CREAR TICKET
const crearTicket = async (req, res) => {
    try {
        const { codigo, descripcion, cliente, tecnico } = req.body;
        // Validar campos obligatorios
        if (!codigo || !descripcion || !cliente || !tecnico) {
            return res.status(400).json({
                msg: "Campos obligatorios incompletos"
            });
        }
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(cliente) ||
            !mongoose.Types.ObjectId.isValid(tecnico)) {
            return res.status(400).json({
                msg: "ID de cliente o técnico no válido"
            });
        }
        // Verificar existencia de cliente y técnico
        const [existeCliente, existeTecnico] = await Promise.all([
            Cliente.findById(cliente),
            Tecnico.findById(tecnico)
        ]);
        if (!existeCliente || !existeTecnico) {
            return res.status(404).json({
                msg: "Cliente o técnico no encontrados"
            });
        }
        // Validar código único
        const codigoExiste = await Ticket.findOne({ codigo: codigo.toUpperCase() });
        if (codigoExiste) {
            return res.status(400).json({
                msg: "El código del ticket ya está en uso"
            });
        }
        // Crear ticket
        const ticket = await Ticket.create({codigo,descripcion,cliente,tecnico});
        res.status(201).json({
            msg: "Ticket creado correctamente",
            ticket
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ msg: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                msg: "El código ya está en uso"
            });
        }
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al crear ticket"
        });
    }
};

// OBTENER TICKETS
const obtenerTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("cliente", "nombre apellido cedula")
            .populate("tecnico", "nombre apellido cedula");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor al obtener tickets"
        });
    }
};

// BUSCAR TICKET
const buscarTicket = async (req, res) => {
    try {
        let { codigo, cliente, tecnico } = req.query;
        if (codigo) codigo = codigo.trim();
        if (cliente) cliente = cliente.trim();
        if (tecnico) tecnico = tecnico.trim();
        if (!codigo && !cliente && !tecnico) {
            return res.status(400).json({
                msg: "Debe enviar al menos un parámetro de búsqueda"
            });
        }
        const filtro = {};
        // Buscar por código
        if (codigo) {
            filtro.codigo = { $regex: codigo, $options: "i" };
        }
        // Buscar por cliente (nombre, apellido o cédula)
        if (cliente) {
            const clientes = await Cliente.find({
                $or: [
                    { nombre: { $regex: cliente, $options: "i" } },
                    { apellido: { $regex: cliente, $options: "i" } },
                    { cedula: { $regex: cliente, $options: "i" } }
                ]
            });
            filtro.cliente = { $in: clientes.map(c => c._id) };
        }
        // Buscar por técnico (nombre, apellido o cédula)
        if (tecnico) {
            const tecnicos = await Tecnico.find({
                $or: [
                    { nombre: { $regex: tecnico, $options: "i" } },
                    { apellido: { $regex: tecnico, $options: "i" } },
                    { cedula: { $regex: tecnico, $options: "i" } }
                ]
            });
            filtro.tecnico = { $in: tecnicos.map(t => t._id) };
        }
        const tickets = await Ticket.find(filtro)
            .populate("cliente", "nombre apellido cedula")
            .populate("tecnico", "nombre apellido cedula");
        if (tickets.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron tickets"
            });
        }
        res.json({ tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al buscar tickets"
        });
    }
};

// ACTUALIZAR TICKET
const actualizarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID no válido"
            });
        }
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                msg: "Ticket no encontrado"
            });
        }
        const { codigo, descripcion, cliente, tecnico } = req.body;
        // Validar código único si viene
        if (codigo) {
            const codigoExiste = await Ticket.findOne({
                codigo: codigo.toUpperCase(),
                _id: { $ne: id }
            });
            if (codigoExiste) {
                return res.status(400).json({
                    msg: "El código ya está en uso"
                });
            }
            ticket.codigo = codigo;
        }
        // Validar cliente si viene
        if (cliente) {
            if (!mongoose.Types.ObjectId.isValid(cliente)) {
                return res.status(400).json({
                    msg: "ID de cliente no válido"
                });
            }
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                return res.status(404).json({
                    msg: "Cliente no encontrado"
                });
            }
            ticket.cliente = cliente;
        }
        // Validar técnico si viene
        if (tecnico) {
            if (!mongoose.Types.ObjectId.isValid(tecnico)) {
                return res.status(400).json({
                    msg: "ID de técnico no válido"
                });
            }
            const existeTecnico = await Tecnico.findById(tecnico);
            if (!existeTecnico) {
                return res.status(404).json({
                    msg: "Técnico no encontrado"
                });
            }
            ticket.tecnico = tecnico;
        }
        if (descripcion !== undefined) {
            ticket.descripcion = descripcion;
        }
        await ticket.save();
        res.json({
            msg: "Ticket actualizado correctamente",
            ticket
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al actualizar ticket"
        });
    }
};

// ELIMINAR TICKET
const eliminarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID no válido"
            });
        }
        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({
                msg: "Ticket no encontrado"
            });
        }
        res.json({
            msg: "Ticket eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor"
        });
    }
};

export {
    crearTicket,
    obtenerTickets,
    buscarTicket,
    actualizarTicket,
    eliminarTicket
};