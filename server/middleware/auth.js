const jwt = require('jsonwebtoken');
require('dotenv').config();
const {User} = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next)=> {
    let token;
    token = req.headers.authorization;

    if(!token){
        return next(new ErrorResponse('Not authorized to acces this route', 401));
    }

    try{
        const verified =  jwt.verify(token, process.env.CHAT_JWT_KEY);

        const user = await User.findById(verified._id);
        
        if(!user){
            return next(new ErrorResponse('No user found with this id', 401));
        }
        
        req.user = user;
        next();
    }
    catch (ex){
        console.log('error');
        return next(new ErrorResponse('Not authorized to acces this route', 401));
    }
}
