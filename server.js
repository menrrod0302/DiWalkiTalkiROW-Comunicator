const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Dispositivo conectado:', socket.id);

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} se unió al canal: ${room}`);
    });

    // Retransmisión inmediata de paquetes de audio crudos
    socket.on('audio-packet', (data) => {
        if (data.room) {
            socket.to(data.room).emit('audio-packet', data.blob);
        }
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor Jarvis corriendo en puerto ${PORT}`);
});
