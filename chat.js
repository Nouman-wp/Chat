const socket = io();
const username = document.getElementById('username').value;
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');

socket.on('load messages', (msgs) => {
  msgs.forEach(msg => {
    appendMessage(`${msg.username}: ${msg.message}`);
  });
});


socket.on('chat message', (data) => {
  appendMessage(`${data.username}: ${data.message}`);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', {
      username: username,
      message: input.value
    });
    input.value = '';
  }
});

function appendMessage(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.className = 'mb-1';
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
