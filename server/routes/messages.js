const express = require('express');
const router = express.Router();
const {addmessage, getMessageById} = require('../controllers/messages');

//http://localhost:5000/chat/api/messages -- add new message
router.post('/', addmessage);

//http://localhost:5000/chat/api/messages/:id -- get message by id
router.get('/:id', getMessageById);

module.exports = router;

