'use strict';

$(function () {
    var socket = io.connect('http://localhost:4000');

    socket.on('connect', function () {
        console.log('wow :)');
    });

    socket.on('server:msg', function (data) {
        console.log("server:msg", data);
        messageTemplate(data);
    });

    socket.on('server:msgHistory', function (data) {
        data.forEach(function (message) {
            messageTemplate(message);
        });
    });

    var $chatMsgInput = $("#ChatMsgInput");
    var $chatList = $("#ChatList");
    var $sendMsgBtn = $("#SendMsgBtn");

    $chatMsgInput.keydown(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (e.keyCode == 13 && !e.shiftKey) {
            $sendMsgBtn.trigger('click');
            return false;
        }
    });

    $sendMsgBtn.click(function (e) {
        e.preventDefault();
        console.log($chatMsgInput.val());
        socket.emit('client:msg', $chatMsgInput.val());
        $chatMsgInput.val('');
    });

    function messageTemplate(msg) {
        var tmpl = '<div class="chat-msg-wrapper">\n            <p class="chat-msg">' + msg.message + '</p>\n            <section class="msg-meta-info">\n                <span class="msg-username" title="User">' + msg.username + '</span>\n                <span class="msg-time" title="Time">' + msg.createdAt + '</span>\n            </section>\n        </div>';
        $chatList.append(tmpl);
    }
});