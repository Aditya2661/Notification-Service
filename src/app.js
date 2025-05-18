require('dotenv').config();
const express = require('express');
const notificationsRouter = require('./routes/notification');

const app = express();

app.use(express.json());


app.use('/notifications', notificationsRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
