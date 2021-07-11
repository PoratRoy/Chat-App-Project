
const express = require('express');
const router = express.Router();
const {register, login, tokenIsValid} = require('../controllers/auth');

//http://localhost:5000/chat/api/auth/register
router.post('/register', register);

//http://localhost:5000/chat/api/auth/login
router.post('/login', login);

//http://localhost:5000/chat/api/auth/tokenIsValid -- is token valid
router.post('/tokenIsValid', tokenIsValid);

module.exports = router;


