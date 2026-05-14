const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// Servir el archivo index.html automáticamente
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    let currentRoom = null;

    // Al unirse a una sala
    socket.on('join-room', (roomId) => {
        if (currentRoom) socket.leave(currentRoom);
        socket.join(roomId);
        currentRoom = roomId;
        console.log(`Usuario unido al canal: ${roomId}`);
    });

    // Recibir audio y enviarlo solo a la sala correspondiente
    socket.on('audio-stream', (data) => {
        // Enviar a todos en la sala menos al que habla
        socket.to(data.room).emit('audio-stream', data.blob);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// El puerto lo asigna Render automáticamente
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});