import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setuser] = useState(""); //a state to capture the entered username
  const [password, setpassword] = useState(""); //a state to capture the entered password
  const navigate = useNavigate(); //react router dom method used to redirect to specifed page

  let auth = { username: user, password: password }; //a js object to store the credentials entered

  //an asynchronous function to handle login
  async function login() {
    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });
      const result = await response.json(); //captured the response

      if (result === "logged in") {
        //if response is 'logged in' (for successful login)
        navigate("/chat", { replace: true }); //replace Home component with chat component
      } else {
        alert(result); //alert the response on failure of login
      }
    } catch (error) {
      console.log(error);
    }
  }

  //asynchronous function to handle registration
  async function register() {
    try {
      await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div id="authbackground">
      <div className="authcontainer">
        <input
          type="text"
          className="inputbox"
          id="usernamefield"
          onChange={(event) => setuser(event.target.value)}
          placeholder="username"
        />
        <input
          type="text"
          className="inputbox"
          id="passwordfield"
          onChange={(e) => setpassword(e.target.value)}
          placeholder="password"
        />
        <button className="btn auth-btn" id="login" onClick={() => login()}>
          login
        </button>
        <button
          className="btn auth-btn"
          id="register"
          onClick={() => register()}
        >
          register
        </button>
      </div>
    </div>
  );
}

export default Home;
