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

| Term                     | Definition                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Event                    | Event for a specific Topic, has a key (~id), value, timestamp and might have metadata                                      |
| Event Key                | an identifier for a nummber of events for a topic. Same key always goes to same partition. Used for Log compaction as well |
| Event Stream             | b                                                                                                                          |
| Broker                   | An instance in the Kafka cluster handling some partitions                                                                  |
| Leader/Follower (Broker) | Leader - A Broker in Kafka that gets produced events first                                                                 |
| Partition                | A part of an event stream on a specific broker                                                                             |
| Segment                  | A part of a partition (e.g. which will be deleted if retention period is reached                                           |
| Topic                    | (Usually) Type of events                                                                                                   |
| Log compaction/Snapshot  |                                                                                                                            |
| Producer                 | Pushes Event on at least one topic to kafka                                                                                |
| Consumer                 | (permanently) polls kafka for at least one topic (Pulls)                                                                   |

## Event Types and Streams

| Term                       | Meaning                                                                                                                                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fact Event Type (Pattern)  | An Event which can be used to rebuild its corresponding Application state (Full facts)                                                                                                                                                                                      |
| Delta Event Type (Pattern) | Only Diff to the previous Application State is sent. fast&small but difficult to rebuild state                                                                                                                                                                              |
| Before-After-Fields        | Log the value beofre and after not just the new value                                                                                                                                                                                                                       |
| Composite Event            | usually a fact event which contains some additional info (like a reason of change)                                                                                                                                                                                          |
| Single Event Stream        | A Stream with one type of events. Mostly used                                                                                                                                                                                                                               |
| Multi Event Stream         | A Stream that contains multiple types of event. <br/>Must be produced by the same producer. Rare. May be used if order of events is very important. Creates tight coupling between Consumers and Producer and means that every consumer need to handle multiple event types |
| Normalized Data            | e.g. Data taken directly from one Database. Danger of Tight coupling and expensive joins on streams                                                                                                                                                                         |
| Denormalized Data          | e.g. Data mixed together and filtered from several Database tables in order to support a common use case                                                                                                                                                                    |

## APIs

- Consumer --> Holt sich Nachrichten von Kafka (Pull)
- Producer --> Erzeugt Nachrichten und schickt an Kafka (Push)
- Admin
- Stream --> Mache aus einem Event ein anderes Event
- Connect --> Anbindung Fremdsysteme, z.B. Datenbanken

## Beispiele

- [Kafka in Typescript](https://javascript.plainenglish.io/a-beginners-introduction-to-kafka-with-typescript-using-nestjs-7c92fe78f638?gi=dc7e0ef4c528)
- [Mit Nest.JS](https://docs.nestjs.com/microservices/kafka)

## Best Practices

- [How to fail at Kafka](https://www.youtube.com/watch?v=xsdoQkoao2U&list=TLPQMTAxMDIwMjIu-3LT0rTWNA&index=2)
  - Kafka's Default Konfig ist für Latenz, nicht für Robustheit
  - Duplicate Message/Idempotency
  - Exception Handling (Was kann alles schief laufen)
  - Data governance (~ Data schema versions, Schema Registry~Avro)
  - Network Bandwidth
  - No metrics...
- [Lessons Learned from Kafka in Production](https://www.youtube.com/watch?v=1vLMuWsfMcA&list=TLPQMTAxMDIwMjIu-3LT0rTWNA&index=2)
- [Designing Events and Event Streams](https://www.youtube.com/watch?v=c1REIERHcuk&list=PLa7VYi0yPIH145SVtPoh3Efv8xZ1ehUYy&index=2)
- Use Schemas for Event Content (e.g. Apache AVRO, Google Protobuf or JSON Schema)
- [Common Apache Kafka Mistakes to Avoid](https://www.youtube.com/watch?v=HkUfzavcLj0)

## Kafka in Browser

- [Confluent Article on Kafka in Browser](https://www.confluent.io/blog/consuming-messages-out-of-apache-kafka-in-a-browser/)
