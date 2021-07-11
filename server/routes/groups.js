const express = require('express');
const router = express.Router();
const {addGroup, getGroupById} = require('../controllers/groups');

//http://localhost:5000/chat/api/groups -- add new group
router.post('/', addGroup);

//http://localhost:5000/chat/api/groups/:id -- get group by id
router.get('/:id', getGroupById);

module.exports = router;

