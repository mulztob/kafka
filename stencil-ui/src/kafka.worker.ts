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
  socket.addEventListener('message', listener);
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
if (socket) {
  socket.close();
  socket = undefined;
}
// socket = new WebSocket(parsed['BACKEND']);

export const getMessages = async (socketServer: string, offset: number) => {
  if (!socket) socket = new WebSocket(socketServer);

  connectListeners(socket);
  if (offset > messages.length) {
    return { newOffset: 0, msg: messages };
  } else {
    const msg = messages.slice(offset);
    return { newOffset: offset + msg.length, msg };
  }
};

export const getMessagesCallback = async (socketServer: string, cb: (msg: string[]) => void) => {
  if (!socket) socket = new WebSocket(socketServer);
  connectListeners(socket);
  let offset = 0;
  const pollMs = 200;

  return new Promise((_, __) => {
    setInterval(() => {
      if (offset > messages.length) {
        offset = 0;
        cb(messages);
      } else {
        const msg = messages.slice(offset);
        offset += msg.length;
        cb(msg);
      }
    }, pollMs);
  });
};
