import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        uppercase: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    tecnico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tecnico",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Ticket", ticketSchema);