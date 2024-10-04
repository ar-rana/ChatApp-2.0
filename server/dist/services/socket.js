"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const pub = new ioredis_1.default({
    host: 'localhost',
    port: 6379,
    username: '',
    password: '',
});
const sub = new ioredis_1.default({
    host: 'localhost',
    port: 6379,
    username: '',
    password: '',
});
class SocketService {
    constructor() {
        console.log("Init Socket Server");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "http://localhost:3000"
            }
        });
        sub.subscribe('MESSAGES');
    }
    initListner() {
        const io = this.io;
        console.log("Init Socket listners...");
        io.on('connect', (socket) => {
            console.log("New socket connected: ", socket.id);
            socket.on('event:message', (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                console.log("Message: ", message);
                // publish to redis
                yield pub.publish('MESSAGES', JSON.stringify({ message }));
            }));
        });
        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGES') {
                console.log("New Message from redis: ", message);
                io.emit("message", message);
            }
        });
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
