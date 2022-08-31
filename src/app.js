const express = require("express");
const app = express();
const router = require("./dbapi");
const PORT = process.env.PORT || 5000;
const cors = require(`cors`);
const {
  Location,
  Buttons,
  List,
  Client,
  LocalAuth,
} = require("whatsapp-web.js");
const msgHandler = require("./msgHandler");
const client = new Client({ authStrategy: new LocalAuth() });
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const msgUrl =
  "https://script.google.com/macros/s/AKfycby0VOJ9W3qDCv9rvshnyctouPKO9eFxPTu7KB0dUrVCO3dLBajcP2NafL-Lw4UVXE83/exec";
// firstMsg:{
//   location:{

//   name:'',
//   adress:'',
//   isMap :false,
//   isNav:false
// },

// msg:"הנכם מוזמנים לזיו שלי מזל טוב"
// } ,
// ifApproved: "כמה ",
// ifDeclined: " למה לא",
// ifNotClear: "מה ?",
// ifUpdateReq: "טוב"}
const keyUrl =
  "https://script.google.com/macros/s/AKfycbwBKyGe8dg6Iq19vCtCfFtS7u4F-nk_4wFG4OXRRSi2yKVPca1KOZPxUcROALAUJ0MQAw/exec";

const session = require("express-session");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(router);
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// client.on("message", async (message) => {
//   console.log(message._data.notifyName);

//   msgHandler
//     .handleMsg(message)
//     .then((response) => {
//       if (typeof response != "object") {
//         return response;
//       } else {
//         let loc = new Location(response.lat, response.lan, response.des);
//         console.log(loc);
//         return loc;
//       }
//     })
//     .then((response) => {
//       client.sendMessage(message.from, response);
//     })
//     .catch((e) => console.log(e));
// });

// ******************************** SERVER INIT **************************************//
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.listen(PORT, (err) =>
  console.log(`server ${err ? " on" : "listening"} port` + PORT)
);
//******************************  main sript  *************************************/

app.post("/api/sendMsgs", async (req, res) => {
  let { numbers, msg } = await req.body;

  // let barierKey = await axios.get(keyUrl);

  // if (barierKey != password || barierKey == undefined || password == undefined)
  //   return res.end(JSON.stringify({ error: "auth error, not aload" }));
  let actionLog = [];
  try {
    numbers.forEach((number, index) => {
      let log = ``;
      let record = {};
      client.isRegisteredUser(`${number}@c.us`).then(function (isRegistered) {
        if (isRegistered) {
          client.sendMessage(`${number}@c.us`, msg);
          log = `******* msg sent to ${number} *********`;
          record = { status: "ok", row: index, msg: log };
        } else {
          log = `***** ${number} is not registerd ******`;
          record = { status: "error", row: index, msg: log };
        }
      });
      actionLog.push(record);
    });
    res.send(JSON.stringify(actionLog));
  } catch (e) {
    console.log(e);
  }
});

client.on("message", async (message) => {
  console.log(message._data.notifyName);
  let response = `hi ${message._data.notifyName}`;
  client.sendMessage(message.from, response);
  
  
  // const constructedUrl = `${msgUrl}?from=${JSON.stringify(
  //   message.from
  // )}&name=${JSON.stringify(message._data.notifyName)}&msg=${JSON.stringify(
  //   message.body
  // )}`;
  // console.log(constructedUrl);
  // axios.get(constructedUrl);
});

//getting response

client.initialize(
  console.log("client initialize ....\n", "to init in initializ")
);

module.exports = client;

// Input: [
//   { id: "customId",
//     body: "button1" },
//   { body: "button2" },
//   { body: "button3" },
//   { body: "button4" },
// ];
// Returns: [
//   { buttonId: "customId", buttonText: { displayText: "button1" }, type: 1 },
//   { buttonId: "n3XKsL", buttonText: { displayText: "button2" }, type: 1 },
//   { buttonId: "NDJk0a", buttonText: { displayText: "button3" }, type: 1 },
// ];

// //getting response
// client.on('message', m => {
//   if (m.type == 'buttons_response') {
//     const {selectedButtonId: bid} = message;
//     if (bid == 'customId') m.reply('You chose button 1')
//     // this is a buttons message response
//   } else if (m.type == 'list_response' /* not sure */) {
//     const {selectedButtonId: bid} = message;
//     if (bid == 'customId') m.reply('You chose list item 2')
//     // this is a list message response
//   }
// });

// client.on("message", (m) => {
//   if (m.type == "buttons_response") {
//     const { selectedButtonId: bid } = message;
//     if (bid == "customId") m.reply("You chose button 1");
//     // this is a buttons message response
//   } else if (m.type == "list_response" /* not sure */) {
//     const { selectedButtonId: bid } = message;
//     if (bid == "customId") m.reply("You chose list item 2");
//     // this is a list message response
//   }
// });
