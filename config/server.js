'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {dbConnection} from './mongo.js';
import limiter from '../src/middleware/valid-num-reqs.js';
import authRoutes from '../src/auth/auth.routes.js';
import clientRoutes from '../src/client/client.routes.js';
import compRoutes from '../src/company/comp.routes.js';


const middlewares = (app)=>{
    app.use(express.urlencoded({extended:false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/interferMS/v1/auth', authRoutes),
    app.use('/interferMS/v1/client', clientRoutes),
    app.use('/interferMS/v1/comp', compRoutes)
}

const conectarDB = async()=>{
    try {
        await dbConnection();
        console.log('Conexion a la base de datos exitosa');
    } catch (error) {
        console.error('Error conectando a la base de datos',error);
        process.exit(1);
    }
}

export const initServer= async()=>{
    const app = express();
    const port = process.env.port || 3006;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (e) {
        console.log(`Server init failed: ${e}`)
    }
}