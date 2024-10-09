import http from 'http'
import SocketService from './services/socket';
import { startConsumer } from './services/kafka';
import prismaClient from "./services/prisma";
import express from 'express';
import cors from 'cors';

const app = express();

const corsOptions = {
    allowedHeaders: ["*"], 
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello, Server Live!!!")
})

app.get("/rooms", (req,res) => {
    res.send("Get all public rooms!!!")
})

app.get("/room", (req,res) => {
    res.send("Get private rooms, specific author!!!")
})

app.delete("/room", (req,res) => {
    res.send("delete private room, specific author")
})

app.post("/create/room", (req,res) => {
    console.log(req.body);
    const room = {
        name: req.body.name,
        type: req.body.type,
    }
    try {
        // const newRoom = prismaClient.rooms.create({
        //     data: room,
        // })
        res.send(room);
    } catch (e) {
        console.log("Something went wronge at room creation");
        res.sendStatus(500);
    }
    
})

async function init() {
    startConsumer();
    const socketService = new SocketService();

    const httpServer = http.createServer(app);
    const PORT = process.env.PORT ? process.env.PORT : 8000

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () =>
        console.log(`Http Server started at PORT:${PORT}`)
    )

    socketService.initListner();
}

init();