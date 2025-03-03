import jwt from 'jsonwebtoken';

import Usuario from '../users/user.model.js';

export const validarJWT = async(req, res, next) =>{

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "There is no petition token"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.MASTERKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'User does not exist in the database'
            })
        }

        if(!usuario.status){
            return res.status(401).json({
                msg:'Not valid token - status user : false'
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Not valid token"
        })
    }
}