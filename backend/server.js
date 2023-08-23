const ws = require("ws");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());//share resources for requests from different origin (different server)
app.use(express.json()); //parse all the requests that are in json format to javascript objects

//connect to the mongodb database server
mongoose
  .connect("mongodb://127.0.0.1:27017/testDB")
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log(error));

  //create a schema 
const userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//create a model using the defined schema
const user = mongoose.model("Usermodel", userschema);


let username = ""; //empty js string 

//api endpoint to handle user login  
app.post("/login", async (req, res) => {
  const authenticationDetails = req.body; //capture the data in the http request body
  const nametest = authenticationDetails.username;
  const psdtest = authenticationDetails.password;
  try {
    const test = await user.findOne({ username: nametest, password: psdtest }); //find the user from mongodb if exists
    if (test) { //if test is true (not empty)
      username = nametest; //set the username string to the signed in username
      res.json("logged in");
    } else {
      res.json("no users by the given credentials please register");
    }
  } catch (error) {
    console.log(error);
  }
});

//api endpoint for handling registration of new user
app.post("/register", async (req, res) => {
  const receivedUserName = req.body.username;
  const receivedPassword = req.body.password;

  try {
    const test = await user.findOne({ username: receivedUserName });//check if the username already exists
    if (!test) { //if username does not exist
      const usr = new user({ //create a new user model 
        username: receivedUserName,
        password: receivedPassword,
      });
      await usr.save(); //save the new created model into the  usermodel collection in the testdb database
      res.send("registration successful");
    } else {
      res.send("username taken");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(5050, console.log("http server running on 5050")); //listen to the http requests in port 5050

const wss = new ws.WebSocketServer({ port: 5000 }); //crete a new websocket conenction and run it on port 5000

wss.on("connection", (ws) => { //listen to a successful websocket connection event and return a callback function (the first argument refers to connected websocket instance)
  ws.send("uname:  " + username);// use send method inbuilt with websocket package to send message
  ws.on("error", console.error); // on error event console log the error
  ws.on("message", (data) => { //listen to message event from client and return a callback function (first argument captures the actual message data)
    console.log(`client sent a message: ${data}`);
    wss.clients.forEach((client) => { //in the websocketserver refer to all the connected clients using the clients method and perform a function on each client using the foreach js method without returning them
      client.send(`${data}`); 
    });
  });
  ws.on("close", () => { //when a client closes the websocket connection return a callback function 
    console.log("client closed the connection");
  });
});
