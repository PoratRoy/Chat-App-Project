
const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema} = require('./User');

const messageSchema = new mongoose.Schema({

    groupId:{
        type:String
    },
    sender: {
        type: String
    },
    text: {
        type: String
    }

},{timestamps:true})

const Message = mongoose.model('Message',messageSchema);

const messageValidate = (input) =>{
    const schema = {
        userId: Joi.objectId().required(),
        text: Joi.string().required().min(0).max(1024),
        time: Joi.date().required()
    } 
    return Joi.validate(input, schema);
}

module.exports.Message = Message;
module.exports.messageSchema = messageSchema;
module.exports.messageValidate = messageValidate;


    // user:{
    //     type:userSchema,
    //     required:true
    // },
    // text:{
    //     type:String,
    //     minlength:0,
    //     maxlength:1024,
    //     required:true
    // },
    // time: {
    //     type: Date,
    //     required:true
    // }