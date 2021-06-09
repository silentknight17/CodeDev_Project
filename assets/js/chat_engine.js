class chatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBoxId=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        console.log('io',io);
        
        this.socket=io.connect('http://localhost:5000',{transports:['websocket']});
        // console.log('this.socket: ',this.socket);
        if(this.userEmail){
            this.connectionHandler();

        }
        console.log('class',this);


    }
    connectionHandler(){
        console.log('function',this);
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection established using sockets');
        });


        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'codedev'

        });


        self.socket.on('user_joined',function(data){
            console.log('a user joined',data);
        });

        // CHANGE :: send a message on pressing the enter key
        $('#chat-message-input').on('keypress',function(e){
            console.log(e.which);
            //ascii code of enter key is 13
            if(e.which===13 ){
                
                let msg = $('#chat-message-input').val();

                //automatic scroll down as user sends a new msg 
                $("#chat-messages-list").stop().animate({ scrollTop: $("#chat-messages-list")[0].scrollHeight}, 200);
    
                if (msg != ''){
                   
                    $('#chat-message-input').val('');
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: 'codedev'
                    });
                   
                    
                }

            }
        })
        // CHANGE :: send a message on clicking the send message button
        
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            //automatic scroll down as user sends a new msg 
            $("#chat-messages-list").stop().animate({ scrollTop: $("#chat-messages-list")[0].scrollHeight}, 200);

            if (msg != ''){
                $('#chat-message-input').val('');
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codedev'
                });
            }
        });

        //sending request for broadcasting if a user presses any key during chat
        $('#chat-message-input').on('keypress',function(){
            self.socket.emit('typing',{
                user_email:self.userEmail
            });

        });

        //receiving request of broadcasting msg ie 'user is typing' to other users 
        self.socket.on('typing',function(data){
            console.log('data is',data.user_email);
            $('#feedback').html(data.user_email+'<i> is typing...<i>')
        });
        
        //receiving request of stop broadcasting msg ie 'user is typing' to other users 
        self.socket.on('stop_typing',function(data){
            $('#feedback').html('')
        });
        
        //receiving the receieve_message request
        self.socket.on('receive_message',function(data){
            console.log('message recieved ',data.message);

            //sending request for broadcasting nothing if a user has send the msg.
            self.socket.emit('stop_typing',{
                user_email:self.userEmail
            });
            //automatic scroll down as new msg arrives
            $("#chat-messages-list").stop().animate({ scrollTop: $("#chat-messages-list")[0].scrollHeight}, 200);
            

            let newMessage=$('<li>');
            let messageType='other-message';

            if(self.userEmail==data.user_email){
                messageType='self-message';
            }
            newMessage.append($('<span>',{
                'html':data.message
            }));
            newMessage.append($('<sub>',{
                'html':data.user_email
            }));
            newMessage.addClass(messageType);
            $('#chat-messages-list').append(newMessage);
            

        })
    
        
       
        $('.open-button').click(function(){
            document.getElementById("user-chat-box").style.display = "block";
        });
        $('.btn-cancel').click(function(){
            document.getElementById("user-chat-box").style.display = "none";
        });

        

    }

}
