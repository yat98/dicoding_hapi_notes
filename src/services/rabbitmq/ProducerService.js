import amqp from 'amqplib';
import rabbitmq from '../../config/rabbitmq.js';

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(rabbitmq.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ProducerService;
