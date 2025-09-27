import { getRabbitMQChannel } from "../config/rabbitmq";

export const consumeEvent = async (
  queue: string,
  handler: (data: any) => Promise<void>
) => {
  const channel = getRabbitMQChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg) {
      try {
        const payload = JSON.parse(msg.content.toString());

        await handler(payload);
        channel.ack(msg);
      } catch (error) {
        console.log(`❌ Error handling message from ${queue}`, error);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(`✅ Consumer started for queue: ${queue}`);
  console.log(`🎧 Listening to ${queue} queue...`);
};
