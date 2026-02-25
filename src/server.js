// Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importación de rutas
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js'
import tecnicoRoutes from './routes/tecnicoRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
// Inicialización
const app = express();

// Middlewares
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Ruta de prueba
app.get('/', (req, res) => {
res.send('Server on');
});
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes)
app.use('/api/tecnicos', tecnicoRoutes)
app.use('/api/tickets',ticketRoutes)
const PORT = process.env.PORT || 3000;

// Exportar app
export default app;