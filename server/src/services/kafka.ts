import { Kafka, Producer } from "kafkajs";
import prismaClient from "./prisma";

const kafka = new Kafka({
    brokers: ["localhost:9092"],
})

let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message:string) {
    const producer = await createProducer();
    await producer.send({
        messages: [{key: `message-${Date.now}`, value: message}],
        topic: "MESSAGES",
    });
    return true;
}

export async function startConsumer() {
    console.log("consumer is running...")
    const consumer = kafka.consumer({groupId: "default"});
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true});

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause}) => {
            if (!message.value) return;
            console.log("message at consumer: ", message.value.toString());
            const parsedMessage = JSON.parse(message.value.toString());
            const messageToDB = JSON.parse(parsedMessage.message);
            console.log("message to DB: ", messageToDB);
            try {
                await prismaClient.message.create({
                    data: {
                        text: messageToDB.text,
                        room: messageToDB.room,
                        from: messageToDB.from,
                    },
                });
            } catch (e) {
                console.log("Something is wronge...", e);
                pause();
                setTimeout(()=>{ consumer.resume([{topic: "MESSAGES"}])}, 60*1000)
            }
        },
    });    
}

export default kafka;