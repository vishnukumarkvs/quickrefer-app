# In EC2

### t2.micro nodejs install

```
For latest release
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_19.x | sudo -E bash -

Stable release
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -

sudo yum install -y nodejs

node -v
```

---

## Basic socket connection

#### package.json

```
{
  "name": "ws",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "http": "^0.0.1-security",
    "nodemon": "^3.0.1",
    "socket.io": "^4.7.1"
  }
}

```

#### index.js

```
import { Server } from "socket.io";
import {createServer} from "http";

const httpServer = createServer();
const io = new Server(httpServer,{
cors: {
origin: "*",
methods: ["GET","POST"]
}
});

io.on("connection", (socket) => {
console.log("a user connected");

socket.on("disconnect", () => {
console.log("user disconnected");
});
});

httpServer.listen(6001,'0.0.0.0');

```

Use http://ipaddr:6001 to connect

---

## Subscribe to topic with http protocol

- Only once needed with ip address
- create a subscription manually in aws console for topic
- for subscription of topic in sns
- use http endpoint
- http://<ec2ip>:port
- in package.json, add "type": "module",
- then configure code inside server and run: node index.js

#### index.js

```


import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();


app.use(bodyParser.text());  // Parse text/plain input
app.use((req, res, next) => {
  try {
    req.body = JSON.parse(req.body);  // Try to parse it as JSON
  } catch(e) {
    // not JSON, moving on
  }
  next();
});


app.post('/', (req, res) => {
    console.log('Received message', req.body);
    if (req.body.Type === 'SubscriptionConfirmation') {
        // AWS sent a subscription confirmation message
        // Visit the URL to confirm the subscription
        axios.get(req.body.SubscribeURL)
            .then(response => {
                console.log('Subscription confirmed.');
                res.status(200).end();
            })
            .catch(error => {
                console.error('Error confirming subscription', error);
                res.status(500).end();
            });
    } else if (req.body.Type === 'Notification') {
        // AWS sent a notification message
        console.log('Received notification:', req.body.Message);
        res.status(200).end();
    } else {
        // Unknown message type
        console.error('Unknown message type:', req.body.Type);
        res.status(400).end();
    }
});

app.listen(6001, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:6001');
});


```

- then click on request confirmation and aws will send post request and it confirms

---

## Final server for websocket connection, sns subscription

index.js

```
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import bodyParser from 'body-parser';
import AWS from 'aws-sdk';

const app = express();
app.use(bodyParser.text()); // Parse text/plain input
app.use((req, res, next) => {
  try {
    req.body = JSON.parse(req.body); // Try to parse it as JSON
  } catch(e) {
// not JSON, moving on
  }
next();
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// AWS SNS
const sns = new AWS.SNS();

app.use(bodyParser.json());

app.post('/', (req, res) => {
  const message = req.body;
  console.log("message received from sns topic",message);

  const messageBody = JSON.parse(message.Message);
  // Emit the message to the corresponding user's room
  io.to(messageBody.toUser).emit("message", messageBody);

  res.status(200).end();
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register",(userId)=>{
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(6001, '0.0.0.0', () => {
  console.log('Server running on port 6001');
});

```
