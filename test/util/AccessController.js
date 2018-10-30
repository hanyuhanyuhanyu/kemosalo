const funcs = require('../../lib/redis/AccessController.js');

const io = require('socket.io-client')
const socket = io('ws://localhost:3000')
funcs.emitWithKey(socket, 'masterPass', {1:1,2:2})
socket.close()
