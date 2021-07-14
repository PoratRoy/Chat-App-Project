import { Link } from "react-router-dom";
import "./LogoutBtn.css";

const LogoutBtn = ({setUserData}) => {
  const handleLogout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-Token", "");
  };

  return (
    <Link to="/" className="link navbar-logout-link" onClick={handleLogout}>
      Log out
      <i className="navbar-logout-icon fas fa-sign-out-alt"></i>
    </Link>
  );
};

export default LogoutBtn;
