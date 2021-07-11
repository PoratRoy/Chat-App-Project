const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {userValidate, User} = require('../models/User');
const auth = require('../middleware/auth.js');
const Joi = require('joi');


//get current user
//http://localhost:5000/chat/api/users/me
router.get('/me', auth, async (req, res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(400).json({error: 'Cant get user'});
        res.status(200).json({
            name: user.name,
            userName: user.userName,
            _id: user._id
        });
    }
    catch(err){
        console.log(err.message);
        res.status(500).json(err);
    }
});

//get all users
//http://localhost:5000/chat/api/users/all
router.get('/all', async (req,res)=>{

    try{
        const users = await User.find().select('_id name');
        
        if(!users) return res.status(400).json({error: 'Cant get users'});

        res.status(200).json(users);
    }
    catch{
        console.log(err.message);
        res.status(500).json(err);    
    }
})


//get user by id or by user name
//http://localhost:5000/chat/api/users/
router.get('/', async (req,res)=>{

    const userId = req.query.userId;
    const userName = req.query.userName;

    try{
        const user = userId ? 
            await User.findById(userId).select('-password') :     
            await User.findOne({userName : userName});
        
        if(!user) return res.status(400).json({error: 'Cant get user'});

        res.status(200).json({
            name: user.name,
            userName: user.userName,
            _id: user._id
        });
    }
    catch{
        console.log(err.message);
        res.status(500).json(err);    
    }
})

//get user by id 
//http://localhost:5000/chat/api/users/id
router.get('/:id', async (req,res)=>{

    try{
        const user = await User.findById(req.params.id).select('_id name')
        if(!user) return res.status(400).json({error: 'Cant get user'});

        res.status(200).json({
            _id: user._id,
            name: user.name,
            userName: user.userName,
        });
    }
    catch (err){
        console.log(err.message);
        res.status(500).json(err);    
    }
})

//register
//http://localhost:5000/chat/api/users/register
router.post('/register', async (req, res) => {

    const {error} = userValidate(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    try{
        let user = await User.findOne({userName : req.body.userName});
        if(user) return res.status(400).json({msg:'user already registered'});
        
        user = new User(_.pick(req.body, ['name', 'userName',  'password']));  
        
        user.password = await user.hashPassword(req.body.password);
        
        await user.save();

        if(!user) return res.status(500).json({msg:'cant register'});

        const token = user.generateAuthToken();

        res.header('x-auth-token',token).status(200).send(_.pick(user, ['name', 'userName']))
    }
    catch(err){
        console.log(err.message);
        res.status(500).json(err);
    }

});

//login
//http://localhost:5000/chat/api/users/login
router.post('/login', async (req, res) => {

    const {error} = loginValidate(req.body);
    if(error) return res.status(400).json({msg:'invalid userName or password'});
    
    try{
        
        let user = await User.findOne({userName : req.body.userName});
        if(!user) return res.status(400).json({msg:'invalid userName or password'});
        
        const result = await user.matchesPassword(req.body.password);
        if(!result) return res.status(400).json({msg:'password'}); 
        
        const token = user.generateAuthToken();
        res.status(200).json({
            token,
            user:{
                _id: user._id,
                name: user.name,
                userName: user.userName
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json(err);
    }

});

const loginValidate = (input) => {
    const schema = {
        userName: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(4).max(255).required(),
    }
    return Joi.validate(input, schema);
}

//is token valid
//http://localhost:5000/chat/api/users/tokenIsValid
router.post('/tokenIsValid', async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);
        
        const verified = jwt.verify(token, 'jwtPrivateKey');
        if(!verified) return res.json(false);
        
        const user = await User.findById(verified._id).select('-password');
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
