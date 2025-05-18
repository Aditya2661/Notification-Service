const amqp = require('amqplib');
const db = require('../config/db');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const inAppService = require('../services/inAppService');

const QUEUE_NAME = 'notifications';
const MAX_ATTEMPTS = 5;

async function initializeWorker() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log('Notification worker is running and waiting for messages...');

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString());
    const { notificationId, userId, type, message, email, phone, attempt = 1 } = payload;

    let delivered = false;

    try {
   
      if (type === 'email') {
        delivered = await emailService.sendEmail(email, message);
      } else if (type === 'sms') {
        delivered = await smsService.sendSMS(phone, message);
      } else if (type === 'in-app') {
        delivered = await inAppService.createInAppNotification(userId, message);
      } else {
        throw new Error('Unsupported notification type');
      }
    } catch (err) {
      delivered = false;
    }

    if (delivered) {

      await db('notifications').where({ id: notificationId }).update({ status: 'sent' });
      channel.ack(msg);
    } else if (attempt < MAX_ATTEMPTS) {
      console.log(`Notification ${notificationId} failed (attempt ${attempt}). Retrying...`);
      channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify({ ...payload, attempt: attempt + 1 })),
        { persistent: true }
      );
      channel.ack(msg);
    } else {
      
      await db('notifications').where({ id: notificationId }).update({ status: 'failed' });
      console.log(`Notification ${notificationId} failed after ${MAX_ATTEMPTS} attempts.`);
      channel.ack(msg);
    }
  }, { noAck: false });
}

initializeWorker().catch(err => {
  console.error('Worker initialization failed:', err);
});
