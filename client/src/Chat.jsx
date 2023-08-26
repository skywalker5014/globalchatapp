import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Chat() {
  const [message, setmessage] = useState([]); //state to capture all the messages received
  const [datatosend, setdatatosend] = useState(""); //state to capture all the messages to be sent
  const [usrname, setusrname] = useState(""); //state tp capture the username after login
  const navigate = useNavigate(); //react router dom method used to redirect to specifed page


  const websocket = new WebSocket("ws://localhost:5000"); //setup a new websocket connection  

  useEffect(() => {//useeffect to synchronize data from the backend 
    websocket.onmessage = (event) => { //listen to message event from the server and capture the message in the message event
      if (event.data.startsWith("uname:")) { //extract the message event and (since first message is string username) use js string method startswith
        const username = event.data.slice(6);
        setusrname(username); //set username state
      } else {
        setmessage((prevMessages) => [...prevMessages, event.data]); //append new message the previous messages to the message state
      }
    };
  }, []);

  function send() {
    websocket.send(datatosend); //send data to the server
    setdatatosend("")//reset the input field after sending the data
  }

  return (
    <>
      <div className="messagecontainer">
        {message.map((element, index) => (
          <div className="messagebox" key={index}>{element}</div>
        ))}
      </div>
      <input
        type="text" 
        id="messagefield"
        value={datatosend}
        onChange={(event) => setdatatosend(`${usrname}: ${event.target.value}`)}
      />
      <button className="btn" id="msgsend" onClick={() => send()}>send</button>
      <button className="btn" id="logout" onClick={() => navigate("/", { replace: true })}>logout</button>
    </>
  );
}

export default Chat;
