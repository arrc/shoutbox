$( () => {
    const socket = io.connect('http://localhost:4000');
    
    socket.on('connect', () => {
        socket.emit('client:join', 'Hello World from client');
    });

    socket.on('server:msg', (data) => {
        console.log("server:msg", data)
        messageTemplate(data)
        document.getElementById('ChatList').lastChild.scrollIntoView(false)
    })

    socket.on('server:msgHistory', (data) => {
        data.forEach(message => {
            messageTemplate(message)
        })
    })

    socket.on('server:error', (data) =>  {
        console.log(data)
    })

    const $chatMsgInput = $("#ChatMsgInput");
    const $chatList = $("#ChatList");
    const $sendMsgBtn = $("#SendMsgBtn");
      
    $chatMsgInput.keydown( (e) => {
        let code = (e.keyCode ? e.keyCode : e.which);
        if (e.keyCode == 13 && !e.shiftKey) {
            $sendMsgBtn.trigger('click');
            return false;
        }
    });

    $sendMsgBtn.click( (e) => {
        e.preventDefault();
        console.log($chatMsgInput.val())
        socket.emit('client:msg', $chatMsgInput.val());
        $chatMsgInput.val('');
    })

    function messageTemplate(msg) {
        let _date = moment(msg.createdAt);
        let formatedDate = _date.format("DD/MM/YYYY")
        let formatedTime = _date.format("HH:MM:SS")
        const tmpl = `<div class="chat-msg-wrapper">
            <p class="chat-msg">${msg.message}</p>
            <section class="msg-meta-info">
                <span class="msg-username" title="User">${msg.username}</span>
                <span class="msg-time" title="${formatedDate}">${formatedTime}</span>
            </section>
        </div>`
        $chatList.append(tmpl);
    }
});