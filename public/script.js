const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
//take user name as soon as user enters
const user=prompt('enter your name');


let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  // answering the call by sending our stream
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
   //when new user gets connected, connecting to that user
  socket.on('user-connected1', userId => {
    connectToNewUser(userId, stream)
  })
  //chat
  let text = $("#chat_message");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message1', text.val());
      text.val('')
    }
  });
  let messages = document.querySelector(".messages");
  socket.on("createMessage1", (message,userName) => {
  
    // checking username -->console.log(userName);
    messages.innerHTML =
    messages.innerHTML +
    `<li class="message">
       <li> <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b></li>
        <li><span>${message}</span></li>
    </li>`;
    scrollToBottom()
  })
})

socket.on('user-disconnected1', userId => {
  if (peers[userId]) peers[userId].close()
})


myPeer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an Audio and video stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});


myPeer.on('open', (id)=> {
  //checking whether user name is taken correctly
  console.log(user);
  console.log('about to join room');
  socket.emit('join-room', ROOM_ID, id,user)
})

// connecting to new user by calling to them
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

// adding the video stream to the page
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

// To mute and unmute 
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

// To play and pause video
const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

// setting mute button
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
//setting unmute button
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
// To stop video
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

// To play video
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
// To getlink when invite button is clicked
const getlink=()=>{
  var content=document.getElementById("content");
  const s=window.location.href;
  content.innerHTML=s;
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}

// To close the modal ,when enter button is clicked
const nodisplay=()=>{
var modal2=document.getElementById("modal2");
modal2.style.display="none";
}

// To toggle chat,when chat icon is clicked
const togglechat=(e)=>{
  e.classList.toggle("active");
  document.body.classList.toggle("videochat");
}
