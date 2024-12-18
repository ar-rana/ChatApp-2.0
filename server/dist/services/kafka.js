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
exports.createProducer = createProducer;
exports.produceMessage = produceMessage;
exports.startConsumer = startConsumer;
const kafkajs_1 = require("kafkajs");
const prisma_1 = __importDefault(require("./prisma"));
const kafka = new kafkajs_1.Kafka({
    brokers: ["localhost:9092"],
});
let producer = null;
function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
function produceMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            messages: [{ key: `message-${Date.now}`, value: message }],
            topic: "MESSAGES",
        });
        return true;
    });
}
function startConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("consumer is running...");
        const consumer = kafka.consumer({ groupId: "default" });
        yield consumer.connect();
        yield consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
        yield consumer.run({
            autoCommit: true,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message, pause }) {
                if (!message.value)
                    return;
                console.log("message at consumer: ", message.value.toString());
                const parsedMessage = JSON.parse(message.value.toString());
                const messageToDB = JSON.parse(parsedMessage.message);
                console.log("message to DB: ", messageToDB);
                try {
                    yield prisma_1.default.message.create({
                        data: {
                            text: messageToDB.text,
                            room: messageToDB.room,
                            from: messageToDB.from,
                        },
                    });
                }
                catch (e) {
                    console.log("Something is wronge...", e);
                    pause();
                    setTimeout(() => { consumer.resume([{ topic: "MESSAGES" }]); }, 60 * 1000);
                }
            }),
        });
    });
}
exports.default = kafka;
