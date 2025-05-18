
const db = require('../config/db');
const emailService = require('./emailService');
const smsService = require('./smsService');
const inAppService = require('./inAppService');

module.exports = {
  createNotification: async (userId, type, message, email = null, phone = null) => {
    let user;
    

    if (userId) {
      user = await db('users').where({ id: userId }).first();
    }

    if (!user && email) {
      [user] = await db('users')
        .insert({ email, phone })
        .onConflict('email')
        .merge({ phone }) 
        .returning('*');
      
      userId = user.id; 
    }

    if (!user) {
      throw new Error('User not found and no email provided');
    }


    const [notification] = await db('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        status: 'pending'
      })
      .returning('*');


    let sendResult;
    try {
      switch(type) {
        case 'email':
          sendResult = await emailService.sendEmail(user.email, message);
          break;
        case 'sms':
          sendResult = await smsService.sendSMS(user.phone, message);
          break;
        case 'in-app':
          sendResult = await inAppService.createInAppNotification(userId, message);
          break;
        default:
          throw new Error('Invalid notification type');
      }
    } catch (error) {
      console.error(`Notification send failed: ${error.message}`);
      sendResult = false;
    }

 
    await db('notifications')
      .where({ id: notification.id })
      .update({ status: sendResult ? 'sent' : 'failed' });

    return notification;
  },

  getNotificationsByUser: async (userId) => {
    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new Error('User not found');
    
    return await db('notifications')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  }
};
