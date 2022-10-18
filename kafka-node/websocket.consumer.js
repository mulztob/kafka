// eslint-disable-next-line no-unused-vars
const { WebSocket, WebSocketServer } = require('ws')
const startConsumer = require('./consumer.js').consumer;

require('dotenv').config();

const wss = new WebSocketServer({
    port: Number(process.env['WEBSOCKET_PORT']),
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
});

/**
 * @type {WebSocket[]}
 */
let sockets = [];
wss.on('connection', (socket) => {
    socket.onclose = (ev) => {
        sockets = sockets.filter(s => s !== ev.target)
        console.log(`socket closed, new number: ${sockets.length}`); socket.close();
    }
    sockets.push(socket);
    console.log(`new socket, # of s: ${sockets.length}`);
})

/**
 * 
 * @param {import('kafkajs').EachMessagePayload} param0 
 */
const handler = async ({ topic, message }) => {
    console.log(`handler
    topic: ${topic},
    message: ${message.key} - ${message.value}`);

    pushToClients(message.value)
}
startConsumer(handler);

const pushToClients = (event) => {
    console.log('pushToClients ', event.toString('utf-8'));
    sockets.forEach(socket => socket.send(event.toString('utf-8')))
}
