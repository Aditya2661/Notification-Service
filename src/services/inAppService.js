const db = require('../config/db');

module.exports = {
  createInAppNotification: async (userId, message) => {
    const [notification] = await db('notifications')
      .insert({
        user_id: userId,
        type: 'in-app',
        message,
        status: 'sent' 
      })
      .returning('*');
    return notification;
  }
};
