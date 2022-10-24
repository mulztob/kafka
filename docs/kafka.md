# Kafka

- Kafka Server ist Java
- Anbindungen gibt es für nahezu alle Sprachen, [Liste von Kafka selbst](https://cwiki.apache.org/confluence/display/KAFKA/Clients), z.B....
  - JS/TS: [kafkajs](https://www.npmjs.com/package/kafkajs), [kafka.node](https://www.npmjs.com/package/kafka-node) - je ca. 500k Downloads/Woche  
    **ACHTUNG: Nur Server-side Javascript**
  - C#: [Confluent.Kafka](https://github.com/confluentinc/confluent-kafka-dotnet) - ca. 19k Downloads/Tag
  - Java: Kafka selbst, Spring for Kafka...
- [Confluent Youtube channel](https://www.youtube.com/c/Confluent)
- Event Streams sind immutable
- Event Order gilt für **eine** partition
- [Kafka Wiki](https://cwiki.apache.org/confluence/display/KAFKA/Index)
- Kafka Cluster in Docker kann auch mit clients (producer/consumer) außerhalb des Docker Netzes arbeiten, **ABER** dafür müssen die kafka clients ein entsprechendes Mapping bekommen (einmal intern, einmal extern)
  siehe: [Kafka Doku](https://kafka.apache.org/documentation/#brokerconfigs_control.plane.listener.name) oder
  [Bitnami Docker Doku: "Accessing Apache Kafka with internal and external clients"](https://hub.docker.com/r/bitnami/kafka)

## Begriffe

| Term                     | Definition                                                                                                                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event                    | Event for a specific Topic, has a key (~id), value, timestamp and might have metadata                                                                                                                                       |
| Event Key                | an identifier for a nummber of events for a topic. Same key always goes to same partition. Used for Log compaction as well                                                                                                  |
| Event Stream             | Events in a topic                                                                                                                                                                                                           |
| Broker                   | An instance in the Kafka cluster handling some partitions                                                                                                                                                                   |
| Leader/Follower (Broker) | Leader - A Broker in Kafka that gets produced events first                                                                                                                                                                  |
| Partition                | A part of an event stream on a specific broker                                                                                                                                                                              |
| Segment                  | A part of a partition (e.g. which will be deleted if retention period is reached                                                                                                                                            |
| Topic                    | Pretty much synonymous to Event Stream. The thing you can subscribe to as a consumer                                                                                                                                        |
| Log compaction/Snapshot  | If a topic's segment reached the end of its retention criteria it gets deleted and reduced to a single event                                                                                                                |
| Producer                 | Pushes Event on at least one topic to kafka                                                                                                                                                                                 |
| Consumer                 | (permanently) polls kafka for at least one topic (Pulls)                                                                                                                                                                    |
| Saga (pattern)           | Design Pattern to organize multiple operations (Consumers/Producers) with an outer boundary. Each Step has an undo ("Compensation") and Saga would abort future step while also undoing all already executed previous steps |

## Event Types and Streams

| Term                             | Meaning                                                                                                                                                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fact Event Type (Pattern)        | An Event which can be used to rebuild its corresponding Application state (Full facts)                                                                                                                                                                                      |
| Delta Event Type (Pattern)       | Only Diff to the previous Application State is sent. fast&small but difficult to rebuild state                                                                                                                                                                              |
| Before-After-Fields              | Log the value(s) before and after not just the new value                                                                                                                                                                                                                    |
| Composite Event                  | usually a fact event which contains some additional info (like a reason of change)                                                                                                                                                                                          |
| Single Event Stream              | A Stream with one type of events. Mostly used                                                                                                                                                                                                                               |
| Multi Event Stream               | A Stream that contains multiple types of event. <br/>Must be produced by the same producer. Rare. May be used if order of events is very important. Creates tight coupling between Consumers and Producer and means that every consumer need to handle multiple event types |
| Normalized Data                  | e.g. Data taken directly from one Database. Danger of Tight coupling and expensive joins on streams                                                                                                                                                                         |
| Denormalized Data                | e.g. Data mixed together and filtered from several Database tables in order to support a common use case                                                                                                                                                                    |
| Idempotency (Pattern)            | Event can be executed multiple time w/o changing the state (e.g. on error you can just retry it w/o changing your application state). Deault: true for Apache Kafka 3.2.0 and later (before: false)                                                                         |
| Message outbox (Pattern)         | [Pattern definition](https://microservices.io/patterns/data/transactional-outbox.html)                                                                                                                                                                                      |
| Dead Letter Queue (DLQ, Pattern) | If a message fails multiple times you can move it to a DLQ. Messages in a DLQ usually involve manual error correction and a complete resend.                                                                                                                                |

## APIs

- Consumer --> Gets messages from Kafka (Pull)
- Producer --> Create messages for one or more topics and sends to Kafka (Push)
- Admin
- Stream --> Take an Event stream and create a different event stream from it
- Connect --> Anbindung Fremdsysteme, z.B. Datenbanken

## Examples

- [Kafka in Typescript](https://javascript.plainenglish.io/a-beginners-introduction-to-kafka-with-typescript-using-nestjs-7c92fe78f638?gi=dc7e0ef4c528)
- [Mit Nest.JS](https://docs.nestjs.com/microservices/kafka)
- [kcat - Debug Tool](https://github.com/edenhill/kcat)

## Best Practices

- [How to fail at Kafka](https://www.youtube.com/watch?v=xsdoQkoao2U&list=TLPQMTAxMDIwMjIu-3LT0rTWNA&index=2)
  - Kafka's Default Config is for latency, not for Robustness (~ Replication Factor, # of brokers, # of ACKs)
    This was changed on newer versions of Kafka ~3.0.0
  - Missing Exception Handling (Not assuming that something can go wrong, ~retry, ~dead letter queue, ~message outbox pattern, ~saga pattern)
  - Duplicate Message/Idempotency
  - No Schema Evolution / Data governance (~ Data schema versions, Confluent Schema Registry, Avro, Google Protocol Buffer etc.)
  - Inadequate Network Bandwidth
    - Adding New Brokers is expensive since they need to replicate a lot of data
  - No Monitoring/metrics...
- [Lessons Learned from Kafka in Production](https://www.youtube.com/watch?v=1vLMuWsfMcA&list=TLPQMTAxMDIwMjIu-3LT0rTWNA&index=2)
  - Watch your In Sync Replica List (ISR)
  - Keep versions consistent
  - Use automated health check
  - Adding Brokers hurts
- [Designing Events and Event Streams](https://www.youtube.com/watch?v=c1REIERHcuk&list=PLa7VYi0yPIH145SVtPoh3Efv8xZ1ehUYy&index=2)
- Use Schemas for Event Content (e.g. Apache AVRO, Google Protobuf or JSON Schema)
- [Common Apache Kafka Mistakes to Avoid](https://www.youtube.com/watch?v=HkUfzavcLj0)
- There are Producer Transactions as well as Consumer and Producer Callback if one needs them
- [Microservice Design Patterns](https://microservices.io/patterns/index.html)

## Kafka in Browser

- [Confluent Article on Kafka in Browser](https://www.confluent.io/blog/consuming-messages-out-of-apache-kafka-in-a-browser/)  
  implemented with Web Worker / Websocket. see kafka-node/websocket.consumer / stencil-ui/kafka.worker.ts

## Message/Topic Schema changes over time

- [Schema evolution, List of Q&A](https://medium.com/expedia-group-tech/practical-schema-evolution-with-avro-c07af8ba1725)
- [Good article on how it is handled in different technologies](https://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html)
- https://developers.google.com/protocol-buffers/docs/overview#updating-defs
