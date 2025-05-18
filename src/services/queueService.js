
const amqp = require('amqplib');

let channel;

async function connect() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('notifications', { durable: true });
  }
  return channel;
}

async function sendToQueue(message) {
  const ch = await connect();
  ch.sendToQueue('notifications', Buffer.from(JSON.stringify(message)), { persistent: true });
}

module.exports = { sendToQueue };
