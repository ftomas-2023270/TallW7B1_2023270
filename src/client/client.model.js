import { Schema, model } from "mongoose";

const Client = Schema({
    name: {
        type: String,
        required: [true, 'Must need a name'],
        minlength: [3,'Must have more than 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Must need an email'],
        unique: [true, 'This email was registred'],
        minlength: [3,'Must have more than 3 characters']
    },
    phone: {
        type: String,
        required: [true, 'Must need an phone'],
        minlength: [3,'Must have more than 3 characters']
    },
    age: {
        type: String,
        minlength: [1,'Must have more than 1 characters']
    },
    status: {
        type: Boolean,
        default: true
    }
})

Client.methods.toJSON = function(){
    const {__v, _id, ...client}=this.toObject();
    client.uid = _id;
    return client;
};

export default model('Client', Client);