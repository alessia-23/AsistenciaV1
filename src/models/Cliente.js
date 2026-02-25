import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    cedula: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length === 10 && !isNaN(v);
            },
            message: "La cédula debe tener exactamente 10 números"
        }
        },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    ciudad: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length === 10 && !isNaN(v);
            },
            message: "El teléfono debe tener exactamente 10 números"
        }
    },
    fecha_nacimiento: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const hoy = new Date();
                const fechaMinima = new Date();
                fechaMinima.setFullYear(hoy.getFullYear() - 100);
                const fechaMaxima = new Date();
                fechaMaxima.setFullYear(hoy.getFullYear() - 16);
                return value >= fechaMinima && value <= fechaMaxima;
            },
            message: "La edad debe estar entre 16 y 100 años"
        }
    },
    dependencia: {
        type: String,
        required: true,
        trim: true,
    },
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Cliente",clienteSchema)