import { Server } from "socket.io";
import Redis from 'ioredis';
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: 'localhost',
  port: 6379,
  username: '',
  password: '',
});
const sub = new Redis({
  host: 'localhost',
  port: 6379,
  username: '',
  password: '',
});

class SocketService {
  private _io : Server;

  constructor() {
    console.log("Init Socket Server");
    this._io = new Server({
      cors : {
        allowedHeaders : ["*"],
        origin: "http://localhost:3000"
      }
    });
    sub.subscribe('MESSAGES');

  }

  public initListner() {
    const io = this.io;
    console.log("Init Socket listners...");

    io.on('connect', (socket)=> {
      console.log("New socket connected: ", socket.id);

      socket.on('event:message', async({message} : {message : String}) => {
        console.log("Message: ", message);
        // publish to redis
        await pub.publish('MESSAGES', JSON.stringify({message}));
      })
    })
    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log("New Message from redis: ", message)
        io.emit("message", message);
        produceMessage(message);
        console.log("message produced to kafka broker...")
      }
    })
  }

  get io() {
    return this._io;
  }

}

export default SocketService;
