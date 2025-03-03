import { Schema, model } from "mongoose";

const Company = Schema({
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
    address: {
        type: String,
        minlength: [1,'Must have more than 1 characters']
    },
    impactlevel: {
        type: Number,
        minlength: [1,'Must have more than 1 characters']
    },
    time: {
        type: Number,
        minlength: [1,'Must have more than 1 characters']
    },
    category: {
        type: String,
        minlength: [1,'Must have more than 1 characters']
    },
    status: {
        type: Boolean,
        default: true
    }
})

Company.methods.toJSON = function(){
    const {__v, _id, ...company}=this.toObject();
    company.uid = _id;
    return company;
};

export default model('Company', Company);