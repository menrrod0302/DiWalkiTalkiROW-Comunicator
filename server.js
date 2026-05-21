const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join-room', (room) => {
        socket.join(room);
    });

    // Retransmite los paquetes de audio crudo inmediatamente
    socket.on('audio-raw', (data) => {
        if (data.room) {
            socket.to(data.room).emit('audio-raw', data.buffer);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
