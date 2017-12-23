$(function () {
    const socket = io.connect('http://localhost:3000');
    
    socket.on('connect', function() {
        console.log('wow :)')
    });
});