
const errorHandler = require('../middleware/error')

const URL = '/chat/api';

const routes = async(app) => {
    
    app.use(`${URL}/`, require('../routes/home')); 
    app.use(`${URL}/auth`, require('../routes/auth')); 
    app.use(`${URL}/private`, require('../routes/private')); 
    app.use(`${URL}/groups`, require('../routes/groups'));
    app.use(`${URL}/messages`, require('../routes/messages'));
    
    app.use(errorHandler);

}

module.exports = routes;