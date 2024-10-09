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
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
const kafka_1 = require("./services/kafka");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    allowedHeaders: ["*"],
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, Server Live!!!");
});
app.get("/rooms", (req, res) => {
    res.send("Get all public rooms!!!");
});
app.get("/room", (req, res) => {
    res.send("Get private rooms, specific author!!!");
});
app.delete("/room", (req, res) => {
    res.send("delete private room, specific author");
});
app.post("/create/room", (req, res) => {
    console.log(req.body);
    const room = {
        name: req.body.name,
        type: req.body.type,
    };
    try {
        // const newRoom = prismaClient.rooms.create({
        //     data: room,
        // })
        res.send(room);
    }
    catch (e) {
        console.log("Something went wronge at room creation");
        res.sendStatus(500);
    }
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kafka_1.startConsumer)();
        const socketService = new socket_1.default();
        const httpServer = http_1.default.createServer(app);
        const PORT = process.env.PORT ? process.env.PORT : 8000;
        socketService.io.attach(httpServer);
        httpServer.listen(PORT, () => console.log(`Http Server started at PORT:${PORT}`));
        socketService.initListner();
    });
}
init();
