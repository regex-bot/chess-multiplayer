const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('create-room', (data) => {
        const { preferredColor, timeControl } = data;
        const roomId = generateRoomId();
        
        rooms.set(roomId, {
            players: [socket.id],
            white: preferredColor === 'white' ? socket.id : null,
            black: preferredColor === 'black' ? socket.id : null,
            creatorColor: preferredColor,
            timeControl: timeControl,
            whiteTime: timeControl,
            blackTime: timeControl,
            gameState: null,
            chatHistory: []
        });

        socket.join(roomId);
        socket.emit('room-created', { roomId, color: preferredColor, timeControl });
        console.log(`Room ${roomId} created by ${socket.id} as ${preferredColor}, time: ${timeControl}s`);
    });

    socket.on('join-room', (roomId) => {
        const room = rooms.get(roomId);

        if (!room) {
            socket.emit('room-error', 'Room not found');
            return;
        }

        if (room.players.length >= 2) {
            socket.emit('room-error', 'Room is full');
            return;
        }

        const joinerColor = room.creatorColor === 'white' ? 'black' : 'white';
        room.players.push(socket.id);
        
        if (joinerColor === 'white') {
            room.white = socket.id;
        } else {
            room.black = socket.id;
        }
        
        socket.join(roomId);

        socket.emit('room-joined', { roomId, color: joinerColor, timeControl: room.timeControl });
        io.to(room.white).emit('opponent-joined', { color: 'white', timeControl: room.timeControl });
        io.to(room.black).emit('opponent-joined', { color: 'black', timeControl: room.timeControl });

        socket.emit('chat-history', room.chatHistory);

        console.log(`${socket.id} joined room ${roomId} as ${joinerColor}`);
    });

    socket.on('make-move', (data) => {
        const { roomId, move } = data;
        const room = rooms.get(roomId);

        if (!room) return;

        socket.to(roomId).emit('opponent-move', move);
        
        if (room.timeControl > 0) {
            io.to(roomId).emit('switch-clock');
        }
        
        console.log(`Move made in room ${roomId}:`, move);
    });

    socket.on('clock-update', (data) => {
        const { roomId, color, time } = data;
        const room = rooms.get(roomId);
        
        if (!room) return;
        
        if (color === 'white') {
            room.whiteTime = time;
        } else {
            room.blackTime = time;
        }
        
        socket.to(roomId).emit('opponent-clock-update', { color, time });
    });

    socket.on('time-expired', (data) => {
        const { roomId, color } = data;
        io.to(roomId).emit('game-over-time', { loser: color });
        console.log(`Time expired for ${color} in room ${roomId}`);
    });

    socket.on('chat-message', (data) => {
        const { roomId, message, sender } = data;
        const room = rooms.get(roomId);
        
        if (!room) return;
        
        const chatMsg = { message, sender, timestamp: Date.now() };
        room.chatHistory.push(chatMsg);
        
        io.to(roomId).emit('chat-message', chatMsg);
        console.log(`Chat in room ${roomId}: ${message}`);
    });

    socket.on('reset-game', (roomId) => {
        const room = rooms.get(roomId);
        if (room && room.timeControl > 0) {
            room.whiteTime = room.timeControl;
            room.blackTime = room.timeControl;
        }
        socket.to(roomId).emit('game-reset');
        console.log(`Game reset in room ${roomId}`);
    });

    socket.on('offer-draw', (roomId) => {
        socket.to(roomId).emit('draw-offered');
        console.log(`Draw offered in room ${roomId}`);
    });

    socket.on('draw-response', (data) => {
        const { roomId, accepted } = data;
        if (accepted) {
            io.to(roomId).emit('draw-accepted');
        } else {
            socket.to(roomId).emit('draw-declined');
        }
        console.log(`Draw ${accepted ? 'accepted' : 'declined'} in room ${roomId}`);
    });

    socket.on('resign', (data) => {
        const { roomId, color } = data;
        io.to(roomId).emit('player-resigned', { color });
        console.log(`${color} resigned in room ${roomId}`);
    });

    socket.on('rematch-request', (roomId) => {
        const room = rooms.get(roomId);
        if (!room) {
            console.log(`Room ${roomId} not found for rematch`);
            return;
        }
        
        if (!room.rematchRequests) {
            room.rematchRequests = new Set();
        }
        
        room.rematchRequests.add(socket.id);
        console.log(`Rematch request from ${socket.id} in room ${roomId}. Total requests: ${room.rematchRequests.size}`);
        
        if (room.rematchRequests.size === 2) {
            const temp = room.white;
            room.white = room.black;
            room.black = temp;
            room.creatorColor = room.creatorColor === 'white' ? 'black' : 'white';
            room.rematchRequests.clear();
            
            if (room.timeControl > 0) {
                room.whiteTime = room.timeControl;
                room.blackTime = room.timeControl;
            }
            
            room.chatHistory = [];
            
            console.log(`Both players agreed! Swapping colors in room ${roomId}`);
            console.log(`New white: ${room.white}, New black: ${room.black}`);
            
            io.to(roomId).emit('rematch-accepted', {
                white: room.white,
                black: room.black,
                timeControl: room.timeControl
            });
        } else {
            socket.to(roomId).emit('rematch-requested');
            console.log(`Notifying opponent about rematch request in room ${roomId}`);
        }
    });

    socket.on('rematch-response', (data) => {
        const { roomId, accepted } = data;
        
        if (!accepted) {
            socket.to(roomId).emit('rematch-declined');
            console.log(`Rematch declined in room ${roomId}`);
        }
    });

    socket.on('leave-room', (roomId) => {
        socket.to(roomId).emit('opponent-left');
        socket.leave(roomId);
        
        const room = rooms.get(roomId);
        if (room) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted - player left`);
        }
    });

    socket.on('game-over', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('game-ended');
        console.log(`Game ended in room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        for (const [roomId, room] of rooms.entries()) {
            if (room.players.includes(socket.id)) {
                socket.to(roomId).emit('opponent-disconnected');
                
                const remainingPlayers = room.players.filter(id => id !== socket.id);
                if (remainingPlayers.length === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                } else {
                    room.players = remainingPlayers;
                    if (room.white === socket.id) room.white = null;
                    if (room.black === socket.id) room.black = null;
                }
                break;
            }
        }
    });
});

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

server.listen(PORT, () => {
    console.log(`Chess server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
