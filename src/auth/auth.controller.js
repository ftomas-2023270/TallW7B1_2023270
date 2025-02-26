import { hash, verify } from 'argon2';
import Usuario from '../users/user.model.js';
import  {generarJWT} from '../helper/generate-jwt.js';

export const register = async(req, res) => {

    try {
        const data = req.body;
        
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash (data.password);
        
        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
            profilePicture
        })

        return res.status(201).json({
            message: "User registred succesfully",
            userDetails:{
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}

export const login = async(req, res) => {

    const {email, password, username} = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase(): null;
        const lowerUsername= username ? username.toLowerCase(): null;

        const user = await Usuario.findOne({
            $or: [{email: lowerEmail}, {username: lowerUsername}]
        });
        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, el correo no esta registrado'
            });
        }   

        if(!user.estado){
            return  res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword= await verify(user.password,password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contrasena es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Login OK',
            userDetails:{
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })


    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "Comuniquese con el administrador",
            error: e.message
        })
    }
}