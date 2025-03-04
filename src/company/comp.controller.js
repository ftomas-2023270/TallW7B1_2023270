import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { response, request } from "express";
import Comp from './comp.model.js';

export const getComps = async (req = request, res = response) =>{
    try {
        const {limite = 10, desde = 0, order = 'aZ', category, time } = req.query;

        const query = { status: true };

        // Si se proporciona un filtro de categoría, se añade al query
        if (category) {
            query.category = category;
        }
        if (time) {
            // Convertir el parámetro `time` a un número
            const timeYears = Number(time);

            // Si `time` no es un número válido, devolvemos un error
            if (isNaN(timeYears)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Invalid time parameter, must be a valid number of years',
                });
            }
            query.time = timeYears
        }


        let sortOrder = {};
        if (order === 'zA') {
            sortOrder.name = -1;  // De Z a A (orden descendente)
        } else if(order === 'aZ') {
            sortOrder.name = 1;   // De A a Z (orden ascendente)
        }

        const [total, comps] = await Promise.all([
            Comp.countDocuments(query),
            Comp.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort(sortOrder)
        ])

        res.status(200).json({
            success: true,
            total,
            companies: comps
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting clients',
            error
        })
    }
}

export const getCompById = async(req,res)=>{
    try {
        const {id} = req.params;

        const c = await Comp.findById(id);

        if(!c){
            return res.status(404).json({
                success: false,
                msg: 'Company not found'
            })
        }

        res.status(200).json({
            success : true,
            c
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting company',
            error
        })
    }
}

export const addComp = async(req, res) => {

    try {
        const data = req.body;
        
        const c = await Comp.create({
            ...data
        })

        return res.status(201).json({
            message: "Company registred succesfully",
            companieDetails:{
                companie: c
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Company registration failed",
            error: error.message
        });
    }
}

export const updateComp = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const {...data }= req.body;

        const c = await Comp.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg:'Company updated',
            c
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error updating company',
            error
        })
    }
}


const projectRootDir = path.resolve();  // Obtiene el directorio raíz del proyecto

export const generateExcel = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const comps = await Comp.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Empresas');

        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Correo', key: 'email', width: 30 },
            { header: 'Teléfono', key: 'phone', width: 20 },
            { header: 'Direccion', key: 'address', width: 30 },
            { header: 'Impacto', key: 'impactlevel', width: 10 },
            { header: 'Años de historia', key: 'time', width: 10 },
            { header: 'Categoria', key: 'category', width: 30 },
            { header: 'Estado', key: 'status', width: 10 }
        ];

        comps.forEach(comp => worksheet.addRow(comp));

        // Ruta de la carpeta donde se guardará el archivo (en la carpeta 'public' en el directorio raíz del proyecto)
        const fileDir = path.join(projectRootDir, 'public');  // Asegúrate de que la carpeta 'public' exista en tu proyecto

        // Verifica si la carpeta 'public' existe, si no, la crea
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // Ruta completa del archivo
        const filePath = path.join(fileDir, 'empresas.xlsx');
        await workbook.xlsx.writeFile(filePath);
        console.log('Archivo Excel generado correctamente en el servidor.');
        // Servir el archivo para su descarga
        res.download(filePath, 'empresas.xlsx', (err) => {
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