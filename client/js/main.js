$(function () {
    const socket = io.connect('http://localhost:4000');
    
    socket.on('connect', function() {
        console.log('wow :)')
    });

    socket.on('server:msg', function(data){
        console.log("server:msg", data)
    })

    const $chatMsgInput = $("#ChatMsgInput");
    const $chatList = $("#ChatList");
    const $sendMsgBtn = $("#SendMsgBtn");


    $chatMsgInput.keydown(function (e) {
        let code = (e.keyCode ? e.keyCode : e.which);
        if (e.keyCode == 13 && !e.shiftKey) {
            $sendMsgBtn.trigger('click');
            return false;
        }
    });

    $sendMsgBtn.click(function(e) {
        e.preventDefault();
        console.log($chatMsgInput.val())
        socket.emit('client:msg', $chatMsgInput.val());
        $chatMsgInput.val('');
    })
});