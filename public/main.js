const socket = io();
let userName = ''

let loginPage = document.querySelector('#loginPage')
let chatPage = document.querySelector('#chatPage')

let userNameInput = document.querySelector('#userNameInput');
let chatTextInput = document.querySelector('#chatTextInput');

let chatInput = document.querySelector(".chat-input");

chatPage.classList.add('hidden-page');

loginPage.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    userName = userNameInput.value.trim();

    if(userName != ''){
        
        document.title = `Chat (${userName})`

        socket.emit('client-request', userName) // 2 - emitindo mensagem para o servidor ao enviar o nome
    }
    
})

const addMessage = (type, user, msg)=>{
    let ul = document.querySelector('.chat-list');

    switch(type){
        case 'status':
            ul.innerHTML += `<li class="m-status">${msg}</li>`
            break;
        case 'msg':
            if(user === userName){
                ul.innerHTML += `<li class="m-txt" style="gap: .3rem;">
                                <p class="userMessage"><span class="me">${user}</span> <br>${msg}</p>  
                            </li>`
            }else{
                ul.innerHTML += `<li class="m-txt " style="gap: .3rem;">
                    <p class="userMessage"><span class="user">${user}</span> <br>${msg}</p>  
                </li>`
            }
           
            break;

    }

    ul.scrollTop = ul.scrollHeight

}
const renderUserList = (userList)=>{
    let ul = document.querySelector(".users-list")
    ul.innerHTML = '';

    userList.forEach(n =>{
        ul.innerHTML += `<li>${n}</li>`
    })

}
socket.on('user-ok',(list)=>{ // 5 - escutando resposta do servidor à nossa mensagem
    loginPage.classList.add('hidden-page')
    chatPage.classList.remove('hidden-page')
    chatTextInput.focus();

    addMessage('status', null, 'Conectado!')
    renderUserList(list)
})


socket.on('list-update', data=>{ // 7 - escutando resposta do servidor às nossas conexões
    if(data.joined){
        addMessage('status', null, `<b>${data.joined}</b> entrou no chat.`)
    } 

    if(data.left){
        addMessage('status', null, `<b>${data.left}</b> saiu no chat.`)
    }
    renderUserList(data.list);
})



chatInput.addEventListener('submit', (e)=>{
    e.preventDefault();
    let msg = document.querySelector('#chatTextInput').value.trim();

    document.querySelector('#chatTextInput').value = '';

    if(msg != ''){
        socket.emit('send-msg', msg)
        addMessage('msg',userName, msg)
    }

})


socket.on('show-msg', data=>{
    addMessage('msg',data.username, data.message)
})

socket.on('disconnect', ()=>{
    addMessage('status', null, 'Você foi desconectado!')
    renderUserList([])
})

socket.on('connect_error', ()=>{
    addMessage('status', null, 'Tentando reconectar...')
})

socket.on('connect',()=>{
    
    if(userName != ''){
        socket.emit('client-request',userName);
    }
})