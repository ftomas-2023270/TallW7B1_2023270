import { Schema, model } from "mongoose";

const Usuario = Schema({
    name: {
        type: String,
        required: [true, 'Must need a name'],
        minlengh: [3,'Must have more than 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Must need an email'],
        minlengh: [3,'Must have more than 3 characters']
    },
    password: {
        type: String,
        required: [true, 'Must need a password'],
        minlengh: [3,'Must have more than 3 characters']
    },
})

User.methods.toJSON = function(){
    const {__v, password, _id, ...usuario}=this.toObject();
    usuario.uid = _id;
    return usuario;
};

export default model('User', Usuario);