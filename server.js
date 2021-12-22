const http = require('http');
const express = require('express');
const SerialPort = require('serialport'); 
const Readline = SerialPort.parsers.Readline;
const { Server } = require("socket.io");

const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static("express"));

app.use('/', function(req,res){
  res.sendFile(path.join(__dirname+'/express/index.html'));
});


const server = http.createServer(app);
const io = new Server(server);
var sPort;
var selectPort;



io.on('connection', (socket) => {
  var portsList = [];
  SerialPort.list().then(ports => {
    ports.forEach(function(port) {
      portsList.push(port.path);
    });
    socket.emit('list-ports', portsList);
  });
 
  

  socket.on('connect-port', (port) => {
    selectPort = port;
    if(sPort){
      sPort.close(function (err) {
        console.log('port closed', err);
        sPort = new SerialPort(
          port,
          {
            baudRate: 9600,
            databits: 4,
            parity: "none",
          },
          false
        );
      });
    } else {
      sPort = new SerialPort(
        port,
        {
          baudRate: 9600,
          databits: 4,
          parity: "none",
        },
        false
      );
    }
    
  });
  socket.on('move', (msg) => {
    console.log('data: ' + msg);
    //change array to bytes
    const buff = Buffer.from(msg);
    if(sPort){
      //send to serial port arduino
      sPort.write(buff, function (err) {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
        console.log("message written");
      });
    } else {
      if(selectPort){
        sPort = new SerialPort(
          selectPort,
          {
            baudRate: 9600,
            databits: 4,
            parity: "none",
          },
          false
        );
      }
    }
  });
});



const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);