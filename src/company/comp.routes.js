import { Router } from "express";
import { check } from "express-validator";
import { addComp,updateComp,generateExcel,getCompById,getComps } from "./comp.controller.js";
import { validarCampos } from "../middleware/validar-campos.js";
import { validarJWT } from "../middleware/validate-jws.js";

const r = new Router();

r.get('/',getComps);

r.get('/doc',validarJWT, generateExcel);

r.get('/:id',
    [
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    getCompById
);

r.post('/',
    [   
        validarJWT,
        check("name", "Must have a valid name").notEmpty(),
        check("email", "Must have a valid email").notEmpty(),
        check("phone", "Must have a valid phone").notEmpty(),
        validarCampos
    ],
    addComp
);

r.put('/:id',
    [
        validarJWT,
        check("id","Must be a valid ID").isMongoId(),
        validarCampos
    ],
    updateComp
);

export default r;