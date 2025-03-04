import { hash, verify } from 'argon2';
import Usuario from '../users/user.model.js';
import  {generarJWT} from '../helper/generate-jwt.js';

export const initUser = async(req, res) => {

    try {
        const data = {
            name: process.env.NAME,
            username: process.env.USER,
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
        }
        
        if((await Usuario.findOne({email:process.env.EMAIL }))){
            return console.log('User already exist')
        } 
        data.password= await hash(data.password)

        const user= new Usuario(data);

        await user.save()

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
                msg: 'Credenciales incorrectas'
            });
        }   

        if(!user.status){
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
                token: token
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