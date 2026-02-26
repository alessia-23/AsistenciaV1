import Cliente from "../models/Cliente.js";
import mongoose from "mongoose";

const crearCliente = async (req, res) => {
    try {
        const {nombre,apellido,cedula,fecha_nacimiento,ciudad,direccion,telefono,email,dependencia} = req.body;
        // Validación manual de campos obligatorios
        if (
            !nombre || !apellido || !cedula ||!fecha_nacimiento || !direccion ||!telefono || !email || !ciudad || !dependencia
        ) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        // Verificar cédula repetida
        const existeCliente = await Cliente.findOne({ cedula });
        if (existeCliente) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        const cliente = new Cliente({nombre,apellido,cedula,fecha_nacimiento,ciudad,direccion,telefono,email,dependencia
        });
        await cliente.save();
        res.status(201).json({
            message: "Cliente creado correctamente",
            cliente
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        console.log(error);
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// OBTENER TODOS LOS CLIENTES
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json({ clientes });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR CLIENTE POR ID
const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar que el ID sea válidoi es decir que esté en la bd
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        res.json({ cliente });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};
// BUSCAR CLIENTE (cedula, apellido o dependencia)
const buscarCliente = async (req, res) => {
    try {
        let { cedula } = req.query;
        // Validar que envíen la cédula
        if (!cedula) {
            return res.status(400).json({
                error: "Debe enviar la cédula"
            });
        }
        cedula = cedula.trim();
        const cliente = await Cliente.findOne({ cedula });
        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        res.json({ cliente });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ACTUALIZAR CLIENTE
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const datosActualizados = { ...req.body };
        // Eliminar campos vacíos
        Object.keys(datosActualizados).forEach(key => {
            if (datosActualizados[key] === "") {
                delete datosActualizados[key];
            }
        });
        // VALIDAR SI QUIERE CAMBIAR LA CÉDULA
        if (datosActualizados.cedula) {
            const clienteExistente = await Cliente.findOne({
                cedula: datosActualizados.cedula
            });
            if (clienteExistente && clienteExistente._id.toString() !== id) {
                return res.status(400).json({
                    error: "La cédula ya pertenece a otro cliente"
                });
            }
        }
        const cliente = await Cliente.findByIdAndUpdate(
            id,
            datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );
        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        res.json({
            message: "Cliente actualizado correctamente",
            cliente
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ELIMINAR CLIENTE
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const cliente = await Cliente.findByIdAndDelete(id);
        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        res.json({
            message: "Cliente eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export {
    crearCliente,
    obtenerClientes,
    buscarCliente,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
};