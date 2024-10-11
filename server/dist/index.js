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
const prisma_1 = __importDefault(require("./services/prisma"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const corsOptions = {
    allowedHeaders: ["*"],
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, Server Live!!!");
});
//tested
app.get("/rooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRooms = yield prisma_1.default.rooms.findMany({
            where: {
                type: 'public',
            },
        });
        res.send(allRooms);
    }
    catch (e) {
        res.sendStatus(400);
    }
}));
app.get("/room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.body.author;
    const authkey = req.body.authkey;
    try {
        const obj = yield prisma_1.default.authKeys.findUnique({
            where: { email: author }
        });
        console.log(obj === null || obj === void 0 ? void 0 : obj.key);
        console.log(authkey);
        const key = obj.key;
        const pass = yield bcrypt_1.default.compare(key, authkey);
        console.log(pass);
        if (pass) {
            const rooms = yield prisma_1.default.rooms.findMany({
                where: {
                    type: 'private',
                    author: author,
                },
            });
            res.send(rooms);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
//tested
app.delete("/room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        yield prisma_1.default.rooms.delete({
            where: { id: id }
        });
        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(404);
    }
}));
//tested
app.post("/create/room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.body);
    try {
        const newRoom = yield prisma_1.default.rooms.create({
            data: {
                name: req.body.name.toString(),
                type: (_a = req.body.type) === null || _a === void 0 ? void 0 : _a.toString(),
                author: (_b = req.body.author) === null || _b === void 0 ? void 0 : _b.toString(),
            },
        });
        res.send(newRoom);
    }
    catch (e) {
        res.sendStatus(400);
    }
}));
app.put("/authkey", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    try {
        const key = (0, uuid_1.v4)();
        const obj = yield prisma_1.default.authKeys.upsert({
            where: { email: user },
            update: { key: key },
            create: { email: user }
        });
        const salt = yield bcrypt_1.default.genSalt();
        const authkey = yield bcrypt_1.default.hash(obj.key, salt);
        res.send(authkey);
    }
    catch (e) {
        res.sendStatus(400);
    }
}));
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
