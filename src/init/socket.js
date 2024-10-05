import { Server as SocketIO } from 'socket.io';

const sendMessage = (io, socket, data) => {
    return { id: socket.id, msg : data }
  }

const handlerMapping = {
    11: sendMessage,
  };

  const handleEvent = (io, socket, { handlerId, data }) => {
    const handler = handlerMapping[handlerId];
    // 적절한 핸들러가 없다면 실패처리합니다.
    if (!handler) {
      socket.emit('response', { status: 'fail', handlerId, message: 'Handler not found' });
      return;
    }

    console.log('핸들러 맵핑 됐네. 아이디랑 데이터 이거야: ', { handlerId, data })
    const response = handler(io, socket, data);
    io.emit('response', { status: 'success', handlerId, data: response });
  };

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  io.on('connection', (socket) => {
    console.log(`안녕, 너 이 아이디로 연결됐어: ${socket.id}`);
    socket.emit('connection', { id: socket.id });

    socket.on('event', (data) => handleEvent(io, socket, data));

    socket.on('chat-message', (data) => {
      io.emit('chat-message', { id: socket.id, msg: data });
    });
  });
};

export default initSocket;
