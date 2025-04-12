const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const io = require('socket.io')(http);
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const Message = require('./models/Message');
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  Message.find().limit(20).sort({ timestamp: 1 }).then(messages => {
    socket.emit('load messages', messages);
  });
  socket.on('chat message', async (data) => {
    const newMessage = new Message({
      username: data.username,
      message: data.message,
    });
    await newMessage.save();
    io.emit('chat message', newMessage); // broadcast to all
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
