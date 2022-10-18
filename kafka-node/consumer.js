const { config } = require('dotenv');
const { Kafka } = require('kafkajs');
const ip = require('ip');

config();
// (async () => await spinUpConsumer())();

//FIXME: example using batches and batchhandler
/**
 * @param {import('kafkajs').EachMessageHandler} [handler]
 */
async function spinUpConsumer(handler) {
    console.log('spinup consumer')
    const host = ip.address();

    const kafka = new Kafka({
        clientId: process.env.KAFKA_CONSUMERID,
        brokers: (process.env?.KAFKA_BROKERS) ? process.env.KAFKA_BROKERS.split(',') : [`${host}:9093`],
    })


    const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUPID ?? '1' })
    await consumer.connect();

    console.log('TOPIC: ', process.env.KAFKA_TOPIC);
    await consumer.subscribe({ topics: [process.env.KAFKA_TOPIC ?? 'msg'] });

    (handler) ? consumer.run({ eachMessage: handler }) : consumer.run({ eachMessage: handleMessage });
}
/**
 * 
 * @param {import('kafkajs').EachMessagePayload} param0 
 */
const handleMessage = async ({ topic, partition, message, heartbeat, pause }) => {
    try {

        console.log({
            key: message.key?.toString(),
            value: message.value?.toString(),
            headers: message.headers,
        });
    }
    catch (error) {
        console.error(error);
    }
}

module.exports.consumer = spinUpConsumer;