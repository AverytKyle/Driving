import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../../redux/session";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  if (sessionUser) return <Navigate to="/dashboard" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(login({ username, password }));

    if (serverResponse) {
      setErrors(serverResponse.errors);
    } else {
      navigate("/dashboard");
    }
  };

  const handleAutoLogin = (e) => {
    e.preventDefault();
    dispatch(login({ username: 'achang_0', password: 'password123' }))
        .then(() => navigate("/dashboard"));
  };

  return (
    <div className="landing-container">
      <h1 className="login-title">Log In</h1>
           {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-username-label">
          User Name
          <input className="login-username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label >
        {errors.username && <p>{errors.username}</p>}
        <label className="login-password-label">
          Password
          <input className="login-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button className="login-submit-button" type="submit">Log In</button>
      </form>
      <button className="auto-login-button" onClick={handleAutoLogin}>
        Auto Login
      </button>
    </div>
  );
}

export default LandingPage;