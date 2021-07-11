const express = require('express');
const router = express.Router();
const {Message} = require('../models/Message');

//post new message
//http://localhost:5000/chat/api/messages
router.post('/', async (req,res)=>{
    const newMessage = new Message(req.body);

    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }
    catch (err){
        res.status(500).json(err);
    }
})

//get message by id
//http://localhost:5000/chat/api/messages/:id
router.get('/:id', async (req, res)=> {
    try{
        const message = await Message.find({
            groupId : req.params.id
        });
        res.status(200).json(message);
    }
    catch (err){
        res.status(500).json(err);
    }
})


module.exports = router;