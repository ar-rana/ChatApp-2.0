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
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"], 
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello, Server Live!!!")
})

//tested , integrated
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

//integrated
app.put("/messages", async (req,res) => {
    const roomid = req.body.roomid;
    try {
        const messages = await prismaClient.message.findMany({
            where: {
                room: roomid,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.send(messages);
    } catch (e) {
        res.sendStatus(400);
    }
})

//tested, integrated
app.put("/room", async (req,res) => {
    const author = req.body.author;
    // const authkey = req.body.authkey;
    // console.log(authkey);
    console.log("author: ", author);

    try {
        // const obj = await prismaClient.authKeys.findUnique({
        //     where: { email: author }
        // })
        // console.log(obj!.key);
        // console.log(authkey);
        // const key = obj!.key;
        // const pass = await bcrypt.compare(key, authkey);
        // console.log(pass);
        if (true) {  // pass
            const rooms = await prismaClient.rooms.findMany({
                where: {
                    author: author,
                    type: 'private',
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

//tested, integrated
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

//tested, integrated
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

//tested
app.put("/authkey", async (req,res) => {
    const user = req.body.user;
    console.log("authkey request: ", user);
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

        res.status(200).send();
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
