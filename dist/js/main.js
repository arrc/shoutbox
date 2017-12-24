"use strict";

$(function () {
    var $chatMsgInput = $("#ChatMsgInput");
    var $chatList = $("#ChatList");
    var $sendMsgBtn = $("#SendMsgBtn");
    var socket = io.connect('http://localhost:4000');

    // Connection established
    socket.on('connect', function () {
        socket.emit('client:join', "I'm in...");
    });

    // On new server message
    socket.on('server:msg', function (data) {
        messageTemplate(data);
        document.getElementById('ChatList').lastChild.scrollIntoView(false);
    });

    // Old messages
    socket.on('server:msgHistory', function (data) {
        data.forEach(function (message) {
            messageTemplate(message);
        });
    });

    // Errors :(
    socket.on('server:error', function (data) {
        console.log(data);
        // Handle error here
    });

    // Send on enter
    $chatMsgInput.keydown(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (e.keyCode == 13 && !e.shiftKey) {
            $sendMsgBtn.trigger('click');
            return false;
        }
    });

    // Transmit the message to the server
    $sendMsgBtn.click(function (e) {
        e.preventDefault();
        socket.emit('client:msg', $chatMsgInput.val());
        $chatMsgInput.val('');
    });

    // Message markup, dirty stuff
    function messageTemplate(msg) {
        var _date = moment(msg.createdAt);
        var formatedDate = _date.format("DD/MM/YYYY");
        var formatedTime = _date.format("HH:MM:SS");
        var tmpl = "<div class=\"chat-msg-wrapper\">\n            <p class=\"chat-msg\">" + msg.message + "</p>\n            <section class=\"msg-meta-info\">\n                <span class=\"msg-username\" title=\"User\">" + msg.username + "</span>\n                <span class=\"msg-time\" title=\"" + formatedDate + "\">" + formatedTime + "</span>\n            </section>\n        </div>";
        $chatList.append(tmpl);
    }
});