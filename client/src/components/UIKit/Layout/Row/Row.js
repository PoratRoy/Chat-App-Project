import './Row.css';

const Row = (props) => {
    return(
        <div className="Row" justify={props.justify}>
            {props.children}
        </div>
    );
}

export default Row;