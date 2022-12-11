import http from 'http'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index'
import socket from 'socket.io';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.use(routes)

const server = http.createServer(app);

const io = new socket.Server(server, {path:'/socket.io'})

let connectedUsers:string[] = [];

io.on('connection', (socket:any) =>{ // 1 - escutando conexão do cliente 
    console.log('Conexão detectada...')

    socket.on('client-request',(name:string)=>{ // 3 - escutando a mensagem do cliente
        socket.username = name as string
        connectedUsers.push(name) // adiciona um novo usuário à lista de usuários conectados
        console.log(connectedUsers) // mostra a lista

        socket.emit('user-ok',connectedUsers) // 4 - emitindo mensagem à mensagem do cliente

        socket.broadcast.emit('list-update',{ // 6 - emitindo mensagem à todas as conexões
            joined:name, list:connectedUsers
        })
    })
    
    socket.on('disconnect', ()=>{
        connectedUsers = connectedUsers.filter(n => n != socket.username)
       
        socket.broadcast.emit('list-update',{left:socket.username, list:connectedUsers})
    })

    socket.on('send-msg', (msg:any)=>{
        let data = {
            username:socket.username,
            message:msg
        }

        socket.broadcast.emit('show-msg',data)
    })
})


server.listen(process.env.PORT)