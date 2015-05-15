'use strict';

var port = 8081;
this.socket = io.connect('scarletapp.no-ip.org:' + port, 
{
  'reconnect' : true,
  'reconnection delay' : 100,
  'max reconnection attempts' : 10
});

socket.on('message', function(data) 
{
  console.log(data);
});

var count = true;
var msg;

$('#switchLazer').click( function()
{
  SwitchLigt();
  return;
});

$('#initPoz').click( function()
{
  socket.emit('btn_click', 'initPoz');
  return;
});

$('#mirrorPoz').click( function()
{
  socket.emit('btn_click', 'mirrorPoz');
  return;
});

$('#screen1').click( function()
{
  socket.emit('btn_click', 'screen1');
  return;
});

$('#screen2').click( function()
{
  socket.emit('btn_click', 'screen2');
  return;
});

function SwitchLigt() 
{
  if(count)
  {
    msg = 'led_on';
    count = false; 
  }
  else
  {
    msg = 'led_off';
    count = true;
  }
  socket.emit('btn_click', msg);
}

$(document).keydown(function(e) {
  switch(e.which) {

    case 37: socket.emit('btn_click', 'left');
    break;

    case 38: socket.emit('btn_click', 'up');
    break;

    case 39: socket.emit('btn_click', 'right');
    break;

    case 40: socket.emit('btn_click', 'down');
    break;

default: return; // exit this handler for other keys
}
e.preventDefault(); // prevent the default action (scroll / move caret)
});