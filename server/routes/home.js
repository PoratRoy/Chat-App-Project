const express = require('express');
const router = express.Router();

//http://localhost:5000/chat/api/
router.get('/', (req,res)=>{
    res.send('hello world')
});


module.exports = router;