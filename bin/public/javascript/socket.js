var socket = io('ws://localhost:3000', {transports: ['websocket']});
var md = require('marked');
var whichPlatform = require('../../helpers/videos');

socket.on('new_message', function(data){
  var temp = document.getElementById('message-list').innerHTML;

  whichPlatform.url = data.content;
  var videoPlatform = whichPlatform();

  switch (videoPlatform) {
    case 'youtube':
      break;
  
    case 'vimeo':
    '<iframe src="https://player.vimeo.com/video/243401046"\
            width="640" height="360" frameborder="0" \
            webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
      break;

    case 'dailymotion':
      break;

    default:
      break;
  }
  
  document.getElementById('message-list').innerHTML = "<li>"
  + data.user.username
  + " : " + md(data.content)
  + "</li>"
  + temp;
});

socket.on('delete_message', function(data) {
  document.getElementById(data).innerHTML = '';
})

socket.on('new_emote', function(data) {
  document.getElementById(data.message).style.color= 'red';
})

socket.on('delete_room', function(data) {
  document.getElementById(data).innerHTML = '';
})

socket.on('user_created', function(data) {
  if (data) {
    window.alert('User created. Please log in again.');
  }
})

// var specifiedElement = document.getElementsByClassName('update');

// document.addEventListener('click', function(event) {
//   var isClickInside = specifiedElement.includes(event.target);
//   if (isClickInside) {
//     console.log('click')
//     specifiedElement.contentEditable = true;
//     specifiedElement.focus();
//   } else {
//     console.log('outside')
//     specifiedElement.contentEditable = false;
//   }
// });