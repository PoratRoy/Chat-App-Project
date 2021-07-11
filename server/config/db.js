
const mongoose = require('mongoose');

const connectDB = async() => {

    try{
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING);
        console.log('Connect to mongodb...');
    }
    catch (error){
        console.log('error');
    }
}

module.exports = connectDB;