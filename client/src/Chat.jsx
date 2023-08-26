import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [message, setmessage] = useState([]); //state to capture all the messages received
  const [datatosend, setdatatosend] = useState(""); //state to capture all the messages to be sent
  const [usrname, setusrname] = useState(""); //state tp capture the username after login
  const navigate = useNavigate(); //react router dom method used to redirect to specifed page

  const websocket = new WebSocket("ws://localhost:5000"); //setup a new websocket connection

  //useeffect to synchronize data from the backend
  useEffect(() => {
    //listen to message event from the server and capture the message in the message event
    websocket.onmessage = (event) => {
      //extract the message event and (since first message is string username) use js string method "startswith"
      if (event.data.startsWith("uname:")) {
        const username = event.data.slice(6);
        setusrname(username); //set username state
      } else {
        setmessage((prevMessages) => [...prevMessages, event.data]); //append new message the previous messages to the message state
        console.log(message);
      }
    };
  }, []);

  function send() {
    if (datatosend === "") {
      return;
    } else {
      websocket.send(datatosend);
      setdatatosend("");
      document.getElementById("messagefield").value = "";
    }
  }

  return (
    <>
      <nav>
        <button
          className="btn"
          id="logout"
          onClick={() => navigate("/", { replace: true })}
        >
          logout
        </button>
      </nav>
      <div className="chatcontainer">
        <div className="messagecontainer">
          {message.map((element, index) => {
            if (element !== "") {
              return (
                <div className="messagebox" key={index}>
                  <i style={{ color: "white" }}>user@{element.split(":")[0]}</i>
                  <br></br>
                  {element.split(":")[1]}
                </div>
              );
            } else {
              return;
            }
          })}
        </div>
        <div className="useraccess">
          <input
            type="text"
            id="messagefield"
            onChange={(event) =>
              setdatatosend(`${usrname}: ${event.target.value}`)
            }
          />
          <button className="btn" id="msgsend" onClick={() => send()}>
            <i className="material-icons">&#xe163;</i>
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
