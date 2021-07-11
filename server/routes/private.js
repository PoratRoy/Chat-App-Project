
const express = require('express');
const router = express.Router();
const {currentUser, allUsers, userById} = require('../controllers/private')
const {protect} = require('../middleware/auth');


//http://localhost:5000/chat/api/private/me -- get current user
router.get('/me',protect, currentUser);

//http://localhost:5000/chat/api/private/all -- get all users
router.get('/all',protect, allUsers);

//http://localhost:5000/chat/api/private/id -- get user by id 
router.get('/:id',protect, userById);


module.exports = router;