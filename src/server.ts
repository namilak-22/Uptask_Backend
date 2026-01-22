import express from 'express';
import dotenv from 'dotenv'//para poder usar las variables de entorno
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

dotenv.config();//se inicializa para poder llamar a las variables de entorno desde cualquier archivo

connectDB()

const server=express();
server.use(cors(corsConfig))

/**
 * *Routes
 * *Se delega el manejador de rutas por el servidor, y se define la ruta que va aplicar para la variable del router
 * *Se usa express.json() para que pueda enviarse por post este tipo de request
 */
//Login
server.use(morgan('dev'))
//Leer datos json del formulario
server.use(express.json())
server.use('/api/auth',authRoutes)
server.use('/api/projects',projectRoutes)

export default server;