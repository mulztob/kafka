# Kafka Demo with Stencil and ...

## Getting Started

## Configuration

## Kafka Cluster `kafka-cluster`

- `docker-compose up -d`
  - contains a single zookeeper and a single broker. Broker can be accessed on port `9092` inside docker or `9093` from host
  - Management-UI on port `8080`
- Cluster is insecure. Not for production!

## consumer/producers `kafka-node`

- npm i
- configure `.env`
  - `KAFKA_PRODUCERTIME` (ms between producing 5 new messages)
  - `KAFKA_BROKERS` to point to at least one broker of the cluster (defaults to <local ip>:9093)
  - `WEBSOCKET_PORT` port for websocket server. take care that WEBSOCKET_PORT and setting stencil-ui/.env/BACKEND are in sync
- `npm run producer.js`
- `npm run websocket.consumer.js`

## UI `stencil-ui`

Example App in Stencil.js which should connect to the websocket.consumer.js and gets events by websocket. Implementation is in kafka.worker.ts (a web worker)

- npm i
- configure `.env`
  - `BACKEND` point to host/port for `kafka-node/[WEBSOCKET_PORT]`
- npm start
