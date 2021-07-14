import Btn from "../../Elements/Btn/Btn";
import Row from "../Row/Row";
import { Link } from "react-router-dom";
import Error from '../../../Errors/ValidationError/ValidationError'
import "./Form.css";

const Form = ({handelSubmit,title,error,children,btn,link,linkTxt }) => {
  return (
    <form onSubmit={handelSubmit}>
      <div className="form">
        <Row justify="center">
          <h1 className="title">{title}</h1>

          {error && <Error error={error}/>}

          {children}

          <Btn className={`form-btn ${btn}`}>{btn}</Btn>

          <Link className="link" to={link}>
            {linkTxt}
          </Link>
        </Row>
      </div>
    </form>
  );
};

export default Form;
