const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);


app.set('view engine', 'ejs')
app.use(express.static('public'))

 app.get('/', (req, res) => {
    const uuid1=uuidV4();
    const uuid2=uuidV4();
    res.render('open.ejs',{ roomid1 : uuid1,roomid2: uuid2})
    
  /*res.redirect(`/${uuidV4()}`)*/

})



app.get('/end',(req,res)=>{
  res.render('leave.ejs')
})

/*app.get('/chat',(req,res)=>{
  res.redirect(`/chat/${uuidV4()}`)
})*/
app.get('/chat/:x',(req,res)=>{
  res.render('chat.ejs', { roomid: req.params.x })
})
 app.get('/:room', (req, res) => {
  res.render('room.ejs', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId,userName) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected1', userId)
    socket.on("message1", (message) => {
      io.to(roomId).emit("createMessage1", message,userName);
    });

    socket.on('disconnect', (userId) => {
      socket.broadcast.to(roomId).emit('user-disconnected1', userId)
    })
  })
  /*chat*/
  socket.on('join-chat-room',(roomId,username)=>{
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', username)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message,username);
    });

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', username)
    })
   /*till*/
  })
  
})

server.listen(process.env.PORT||3000)