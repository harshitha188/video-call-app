const socket = io('/')


const user=prompt('enter your name');
socket.emit('join-chat-room',RoomId,user);
console.log('joined already')

// when  new user connects to server it shows in chat
socket.on('user-connected', username=> {
  let messages = document.querySelector(".messages");
  messages.innerHTML=messages.innerHTML+
  `<li class="message" style='background-color:grey;text-align:center;'>
     <span> # ${username} joined #</span>
     </li>`
  })
  let text = $("#chat_message");

  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  let messages = document.querySelector(".messages");
  
  messages.scrollTop=messages.scrollHeight;
  socket.on("createMessage", (message,userName) => {
   
   //appending message received to chat window
    messages.innerHTML =
    messages.innerHTML +
    `<li class="message" >
       <li> <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b></li>
        <li><span>${message}</span></li>
        <br>
    </li>`;
    scrollToBottom()})
     //when the user gets disconnected,it shows in the chat
    socket.on('user-disconnected', username=> {
      let messages = document.querySelector(".messages");
      messages.innerHTML=messages.innerHTML+
      `<li class="message" style='background-color:grey;text-align:center;'>
         <span> # ${username} disconnected #</span>
         </li>`
      })

      const scrollToBottom = () => {
        var d = $('.main__chat_window');
        d.scrollTop(d.prop("scrollHeight"));
      }
     
