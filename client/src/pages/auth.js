import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    return (
      <div className="auth">
        <h1>Authentication</h1>
        <div className="auth-container">
          <div className="form-container">
            <Login />
          </div>
          <div className="form-container">
            <Register />
          </div>
        </div>
      </div>
    ); }
  
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
  
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post("http://localhost:3001/auth/login", {
            email,
            password,
          });
          setCookies("access_token", response.data.token);
          navigate("/");
          alert("Login Successful.");
          window.localStorage.setItem("userID", response.data.userID);
        } catch (err) {
          if (err.response) {
            console.error(err.response.data);
          } else {
            console.error(err.message);
          }
        }
      };
  
    return (
      <form onSubmit={onSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </div>
        <button type="submit">Login</button>
      </form>
    );
  };
  
  const Register = () => {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
  
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post("http://localhost:3001/auth/register", {
            firstName: first,
            lastName: last,
            email,
            balance: 500,
            password,
          });
          alert("Registration Successful.");
    
          try {
            const loginResponse = await axios.post("http://localhost:3001/auth/login", {
              email,
              password,
            });
            setCookies("access_token", loginResponse.data.token);
            window.localStorage.setItem("userID", loginResponse.data.userID);
            navigate("/");
          } catch (loginErr) {
            if (loginErr.response) {
              console.error(loginErr.response.data);
            } else {
              console.error(loginErr.message);
            }
          }
        } catch (err) {
          if (err.response) {
            console.error(err.response.data);
          } else {
            console.error(err.message);
          }
        }
      };
    
  
    return (
      <form onSubmit={onSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="first">First Name:</label>
          <input
            type="text"
            id="first"
            value={first}
            onChange={(event) => {
              setFirst(event.target.value);
            }}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="last">Last Name:</label>
          <input
            type="text"
            id="last"
            value={last}
            onChange={(event) => {
              setLast(event.target.value);
            }}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </div>
        <button type="submit">Register</button>
      </form>
    );
  };