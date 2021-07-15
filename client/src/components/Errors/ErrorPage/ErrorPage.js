import NotAuthorized from '../TypesOfErrors/NotAuthorized/NotAuthorized';
import PageNotFound from '../TypesOfErrors/PageNotFound/PageNotFound';
import ServerError from '../TypesOfErrors/ServerError/ServerError';

const ErrorPage = ({statusCode}) => {
    
    if(statusCode === 401 || statusCode === 403){
        return (<NotAuthorized/>)
    }
    else if(statusCode < 500){
        return (<PageNotFound/>)
    }
    else{
        return (<ServerError/>)
    }
}

export default ErrorPage;

