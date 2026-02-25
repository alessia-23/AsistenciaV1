// Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


// Importación de rutas
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js'
import tecnicoRoutes from './routes/tecnicoRoutes.js'

// Inicialización
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Ruta de prueba
app.get('/', (req, res) => {
res.send('Server on');
});
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes)
app.use('/api/tecnicos', tecnicoRoutes)

const PORT = process.env.PORT || 3000;

// Exportar app
export default app;