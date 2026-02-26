import Tecnico from "../models/Tecnico.js";
import mongoose from "mongoose";

// CREAR TECNICO
const crearTecnico = async (req, res) => {
    try {
        const {nombre,apellido,cedula,fecha_nacimiento,genero,ciudad,direccion,telefono,email} = req.body;
        // Validar campos obligatorios
        if (!nombre || !apellido || !cedula ||!fecha_nacimiento || !direccion ||!telefono || !email || !ciudad || !genero
        ) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        // Verificar si la cédula ya existe
        const existeTecnico = await Tecnico.findOne({ cedula });
        if (existeTecnico) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        const tecnico = new Tecnico({nombre,apellido,cedula,fecha_nacimiento,genero,ciudad,direccion,telefono,email
        });
        await tecnico.save();
        res.status(201).json({
            message: "Técnico creado correctamente",
            tecnico
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// OBTENER TODOS
const obtenerTecnicos = async (req, res) => {
    try {
        const tecnicos = await Tecnico.find();
        res.json({ tecnicos });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR TÉCNICO POR ID
const obtenerTecnicoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const tecnico = await Tecnico.findById(id);
        if (!tecnico) {
            return res.status(404).json({
                error: "Técnico no encontrado"
            });
        }
        res.json({ tecnico });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR POR CÉDULA 
const buscarTecnico = async (req, res) => {
    try {
        let { cedula } = req.query;
        // Validar que envíen la cédula
        if (!cedula) {
            return res.status(400).json({
                error: "Debe enviar la cédula"
            });
        }
        cedula = cedula.trim();
        const tecnico = await Tecnico.findOne({ cedula });
        if (!tecnico) {
            return res.status(404).json({
                error: "Técnico no encontrado"
            });
        }
        res.json({ tecnico });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ACTUALIZAR TECNICO
const actualizarTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const datosActualizados = { ...req.body };
        // Limpiar strings y eliminar vacíos
        Object.keys(datosActualizados).forEach(key => {
            if (typeof datosActualizados[key] === "string") {
                datosActualizados[key] = datosActualizados[key].trim();
            }
            if (datosActualizados[key] === "") {
                delete datosActualizados[key];
            }
        });
        // VALIDACIÓN IMPORTANTE DE CÉDULA
        if (datosActualizados.cedula) {
            const tecnicoExistente = await Tecnico.findOne({
                cedula: datosActualizados.cedula
            });
            if (tecnicoExistente && tecnicoExistente._id.toString() !== id) {
                return res.status(400).json({
                    error: "La cédula ya pertenece a otro técnico"
                });
            }
        }
        const tecnico = await Tecnico.findByIdAndUpdate(
            id,
            datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );
        if (!tecnico) {
            return res.status(404).json({
                error: "Técnico no encontrado"
            });
        }
        res.json({
            message: "Técnico actualizado correctamente",
            tecnico
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ELIMINAR TECNICO
const eliminarTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const tecnico = await Tecnico.findByIdAndDelete(id);
        if (!tecnico) {
            return res.status(404).json({
                error: "Técnico no encontrado"
            });
        }
        res.json({
            message: "Técnico eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export {
    crearTecnico,
    obtenerTecnicos,
    buscarTecnico,
    actualizarTecnico,
    eliminarTecnico,
    obtenerTecnicoPorId
};