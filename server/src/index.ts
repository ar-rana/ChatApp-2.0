import http, { request } from 'http'
import SocketService from './services/socket';
import { startConsumer } from './services/kafka';
import prismaClient from "./services/prisma";
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const corsOptions = {
    allowedHeaders: ["*"], 
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello, Server Live!!!")
})

//tested
app.get("/rooms", async (req,res) => {
    try {
        const allRooms = await prismaClient.rooms.findMany({
            where: {
                type: 'public',
            },
        })
        res.send(allRooms);
    } catch (e) {
        res.sendStatus(400);
    }
})

app.get("/room", async (req,res) => {
    const author = req.body.author;
    const authkey = req.body.authkey;

    try {
        const obj = await prismaClient.authKeys.findUnique({
            where: { email: author }
        })
        console.log(obj?.key);
        console.log(authkey);
        const key = obj!.key;
        const pass = await bcrypt.compare(key, authkey);
        console.log(pass);
        if (pass) {
            const rooms = await prismaClient.rooms.findMany({
                where: {
                    type: 'private',
                    author: author,
                },
            })
            res.send(rooms);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(500);
    }
})

//tested
app.delete("/room", async (req,res) => {
    const id = req.body.id;
    try {
        await prismaClient.rooms.delete({
            where : {id: id}
        })
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
    }
})

//tested
app.post("/create/room", async (req,res) => {
    console.log(req.body);
    try {
        const newRoom = await prismaClient.rooms.create({
            data: {
                name : req.body.name.toString(),
                type : req.body.type?.toString(),
                author: req.body.author?.toString(),
            },
        })
        res.send(newRoom);
    } catch (e) {
        res.sendStatus(400);
    }
})

app.put("/authkey", async (req,res) => {
    const user = req.body.user;
    try {
        const key = uuidv4();
        const obj = await prismaClient.authKeys.upsert({
            where : { email : user },
            update: { key: key },
            create: {email : user}
        })
        const salt = await bcrypt.genSalt();
        const authkey = await bcrypt.hash(obj.key, salt);
        res.send(authkey);
    } catch (e) {
        res.sendStatus(400);
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
