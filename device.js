'use strict';

// declare dependencies
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var five = require("johnny-five"), servo;
var board = new five.Board();

// open socket
server.listen(8081);

// set website
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res)
{
	res.render('index.html');
});

// start server and listen on port:
app.listen(80, function(){});

app.get('/', function (req, res) 
{
	res.sendfile(__dirname + '/index.html');
});

board.on("ready", function() 
{

io.on('connection', function(socket)
{
	console.log('user connected');
  
	socket.on('disconnect', function()
	{
		console.log('user disconnected');
	});

// create led instance
var led = new five.Led(
{
	pin: 13
});

led.off();

var servo1 = new five.Servo(
{
    id: "MyServo",     // User defined id
    pin: 10,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [10,180],    // Default: 0-180
    fps: 100,          // Used to calculate rate of movement between positions
    isInverted: false, // Invert all specified positions
    startAt: 105,       // Immediately move to a degree
    //center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"] 
    }
  });

var servo2 = new five.Servo(
{
    id: "MyServo",     // User defined id
    pin: 9,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [20,180],    // Default: 0-180
    fps: 100,          // Used to calculate rate of movement between positions
    isInverted: false, // Invert all specified positions
    startAt: 50,       // Immediately move to a degree
    //center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"] 
    }
  });


socket.on('btn_click', function(data)
{

  console.log("data: " + data);

	if(data === 'initPoz')
  {
    console.log('initPoz');
    servo1.to(105);
    servo2.to(50);
  }

  else if(data === 'mirrorPoz')
  {
    console.log('mirrorPoz');
    servo1.to(10);
    servo2.to(50);
  }

  else if(data === 'screen1')
  {
    console.log('screen1');
    servo1.to(170);
    servo2.to(50);
  }

  else if(data === 'screen2')
  {
    servo1.to(145);
    servo2.to(55);
    console.log('screen2');
  }

	else if(data === 'led_on')
	{
		led.on();		
	}

	else if(data === 'led_off')
	{
		led.off();		
	}

	// servo

	else if(data === "up") 
  {
    servo2.step( 2 );
  } 

  else if (data === "down") 
  {
    servo2.step( -2 );

  } 

  else if (data === "left") 
  {
    servo1.step( 2 );
  } 

  else if (data === "right") 
  {
    servo1.step( -2 );

  }

});


// execute terminal commands
socket.on('TerminalInput', function(data) 
{
  exec(data, puts);
  console.log(puts);
  TerminalAnswer('index.js');

});

function TerminalAnswer(data)
{
  socket.emit('TerminalAnswer', data);
}

});



// Video Streaming

if( process.argv.length < 3 ) {
  console.log(
    'Usage: \n' +
    'node stream-server.js <secret> [<stream-port> <websocket-port>]'
    );
  process.exit();
}

var STREAM_SECRET = process.argv[2],
STREAM_PORT = process.argv[3] || 8082,
WEBSOCKET_PORT = process.argv[4] || 8084,
  STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

  var width = 320,
  height = 240;

// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  var streamHeader = new Buffer(8);
  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, {binary:true});

  console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

  socket.on('close', function(code, message)
  {
    var messageClose = 'Disconnected WebSocket ('+socketServer.clients.length+' total)';
    console.log( messageClose );
});



});

socketServer.broadcast = function(data, opts) {
  for( var i in this.clients ) {
    this.clients[i].send(data, opts);
  }
};


// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
  var params = request.url.substr(1).split('/');
  width = (params[1] || 320)|0;
  height = (params[2] || 240)|0;

  if( params[0] == STREAM_SECRET ) {
    console.log(
      'Stream Connected: ' + request.socket.remoteAddress + 
      ':' + request.socket.remotePort + ' size: ' + width + 'x' + height
      );
    request.on('data', function(data){
      socketServer.broadcast(data, {binary:true});
    });
  }
  else {
    console.log(
      'Failed Stream Connection: '+ request.socket.remoteAddress + 
      request.socket.remotePort + ' - wrong secret.'
      );
    response.end();
  }
}).listen(STREAM_PORT);

console.log('Listening for MPEG Stream on: '+STREAM_PORT);
console.log('Awaiting WebSocket connections on: '+WEBSOCKET_PORT);


// linux shell
var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("ls -la", puts);

var cameraNum = "video0";
exec("sudo ffmpeg -s 640x480 -f video4linux2 -i /dev/" + cameraNum + " -f mpeg1video -b 800k -r 30 http://scarletapp.no-ip.org:8082/uesamen/640/480/", puts);

});