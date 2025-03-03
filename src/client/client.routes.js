import { Router } from "express";
import { check } from "express-validator";
import { addClient, updateClient, getClientById,getClients,deleteClient, generateExcel} from "./client.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/validate-jws.js";

const r = new Router();

r.get('/',getClients);

r.get('/doc',validarJWT, generateExcel);

r.get('/:id',
    [
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    getClientById
);

r.post('/',
    [   
        validarJWT,
        check("name", "Must have a valid name").notEmpty(),
        check("email", "Must have a valid email").notEmpty(),
        check("phone", "Must have a valid phone").notEmpty(),
        validarCampos
    ],
    addClient
);

r.put('/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    updateClient
);

r.delete('/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    deleteClient
);

export default r;