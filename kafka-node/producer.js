const { config } = require('dotenv');
const { Kafka, CompressionTypes } = require('kafkajs');
const ip = require('ip');

config();

(async () => spinUpProducer())();


async function spinUpProducer() {
    const host = ip.address();
    console.log('ip: ', host);
    const kafka = new Kafka({
        clientId: process.env['KAFKA_PRODUCERID'],
        brokers: (process.env?.KAFKA_BROKERS) ? process.env.KAFKA_BROKERS.split(',') : [`${host}:9093`],
    })

    console.log('TOPIC: ', process.env['TOPIC']);

    const producer = kafka.producer()
    await producer.connect();

    let key = 0;
    setInterval(() => {
        produceMessages(producer, key.toLocaleString()); key++;
    }, Number(process.env['KAFKA_PRODUCERTIME']));
}

/**
 * 
 * @param {import('kafkajs').Producer} producer 
 * @param {string} key
 * */
async function produceMessages(producer, key) {
    try {
        /**
         * @type {import('kafkajs').Message[]}
         */
        console.log(`iteration ${key}`);
        const newMessages = [
            { key, value: `message-${key}-001` },
            { key, value: `message-${key}-002` },
            { key, value: `message-${key}-003` },
            { key, value: `message-${key}-004` },
            { key, value: `message-${key}-005` },
        ]
        await producer.send({ topic: process.env['KAFKA_TOPIC'] || 'msg', messages: newMessages, compression: CompressionTypes.GZIP })
    }
    catch (err) {
        console.error(err);
    }
}
