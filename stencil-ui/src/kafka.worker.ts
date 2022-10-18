let messages: string[] = [];

const listener = (e: MessageEvent<Buffer>) => {
  const msg = e.data.toString('utf8');

  if (messages.length > 1000) {
    console.log('compaction happend');
    messages = [msg];
  } else {
    messages = messages.concat(msg);
  }
};

const connectListeners = (socket: WebSocket) => {
  // socket.onmessage = listener;
  socket.addEventListener('message', listener, { once: true });
  socket.onopen = ev => console.log('open ', ev);
  socket.onerror = e => {
    console.error(e);
    return 'connection error';
  };
  socket.onclose = ev => {
    console.log('close ', ev);
  };
};

let socket: WebSocket;
if (socket) socket.close();
socket = new WebSocket('ws://localhost:8007');

export const getMessages = async (offset: number) => {
  connectListeners(socket);
  if (offset > messages.length) {
    return { newOffset: 0, msg: messages };
  } else {
    const msg = messages.slice(offset);
    return { newOffset: offset + msg.length, msg };
  }
};
