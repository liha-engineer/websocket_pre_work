const socket = io();

const handlerMapping = {
  sendMessage: 11,
};

const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');

const sendMessage = () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('event', {
      handlerId: handlerMapping.sendMessage,
      data: message,
    });
    messageInput.value = '';
  }
};

messageInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

socket.on('connection', ({ id }) => {
  const idDiv = document.getElementById('socket-id');
  if (idDiv) {
    idDiv.innerText = id;
  }
});

const addMessage = ({ id, msg }) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');

  const name = document.createElement('div');
  name.classList.add('name');
  name.textContent = id; 

  const socketId = document.getElementById('socket-id').innerText;
  if (id === socketId) {
    name.style.color = 'red';
  }

  const message = document.createElement('div');
  message.classList.add('message');
  message.textContent = msg;

  messageElement.appendChild(name);
  messageElement.appendChild(message);

  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // 자동 스크롤
};

socket.on('response', ({ status, handlerId, data }) => {
  console.log({ status, handlerId, data })
  if (status === 'fail') {
    socket.emit('response', { status: status, handlerId : handlerId, message: 'Server Error' });
    return;
  } else {
    switch (handlerId) {
      case handlerMapping.sendMessage:
        addMessage(data);
        break;
    }
  }
});
