import "./Btn.css";

const Btn = (props) => {
  return (
    <button
      className={`btn ${props.className}`}
      type="submit"
      onSubmit={props.handleSubmit}
    >
      {props.children}
    </button>
  );
};

export default Btn;
