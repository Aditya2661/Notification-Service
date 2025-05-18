const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

router.post('/', async (req, res) => {
  try {
    const { userId, email, phone, type, message } = req.body;

 
    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const notification = await notificationService.createNotification(
      userId,
      type,
      message,
      email,
      phone
    );
    
    res.status(201).json(notification);

  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});


router.get('/users/:id/notifications', async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await notificationService.getNotificationsByUser(userId);
    res.json(notifications);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
