import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { response, request } from "express";
import Client from "./client.model.js";

export const getClients = async (req = request, res = response) =>{
    try {
        const {limite = 10, desde = 0} = req.query;
        const query = {status : true};

        const [total, clients] = await Promise.all([
            Client.countDocuments(query),
            Client.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            clients
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting clients',
            error
        })
    }
}

export const getClientById = async(req,res)=>{
    try {
        const {id} = req.params;

        const c = await Client.findById(id);

        if(!c){
            return res.status(404).json({
                success: false,
                msg: 'Client not found'
            })
        }

        res.status(200).json({
            success : true,
            c
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting client',
            error
        })
    }
}

export const addClient = async(req, res) => {

    try {
        const data = req.body;
        
        const c = await Client.create({
            ...data
        })

        return res.status(201).json({
            message: "Client registred succesfully",
            clientDetails:{
                client: c
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Client registration failed",
            error: error.message
        });
    }
}

export const updateClient = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const {email, ...data }= req.body;

        const c = await Client.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg:'Client updated',
            c
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error updating client',
            error
        })
    }
}

export const deleteClient = async(req,res)=>{
    try {
        
        const {id} = req.params;

        const c = await Client.findByIdAndUpdate(id, {status: false},{new: true});

        const authClient = req.c;

        res.status(200).json({
            succes : true,
            msg: 'Client desactivated',
            c,
            authClient
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error desactivating client',
            error
        })
    }
};



const projectRootDir = path.resolve();  // Obtiene el directorio raíz del proyecto

export const generateExcel = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const clients = await Client.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Clientes');

        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Correo', key: 'email', width: 30 },
            { header: 'Teléfono', key: 'phone', width: 20 },
            { header: 'Edad', key: 'age', width: 10 },
            { header: 'Estado', key: 'status', width: 10 }
        ];

        clients.forEach(client => worksheet.addRow(client));

        // Ruta de la carpeta donde se guardará el archivo (en la carpeta 'public' en el directorio raíz del proyecto)
        const fileDir = path.join(projectRootDir, 'public');  // Asegúrate de que la carpeta 'public' exista en tu proyecto

        // Verifica si la carpeta 'public' existe, si no, la crea
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // Ruta completa del archivo
        const filePath = path.join(fileDir, 'clientes.xlsx');
        await workbook.xlsx.writeFile(filePath);
        console.log('Archivo Excel generado correctamente en el servidor.');
        // Servir el archivo para su descarga
        res.download(filePath, 'clientes.xlsx', (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).json({ success: false, msg: 'Error al enviar el archivo' });
            }
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error generating Excel file',
            error: error.message
        });
    }
};