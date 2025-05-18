## Notification Service

A scalable and reliable notification system built with Node.js, Express, PostgreSQL, and RabbitMQ. This service delivers messages via Email, SMS, and In-App channels, leveraging asynchronous processing and a robust retry mechanism.

---

### Key Features

* **RESTful API**: Endpoints to send and retrieve notifications.
* **Multi-Channel Delivery**: Email, SMS, and In-App messaging.
* **Automatic User Creation**: New users are created on-the-fly when sending notifications.
* **Asynchronous Processing**: RabbitMQ queues ensure non-blocking delivery.
* **Retry Logic**: Failed messages are retried up to 5 times before marking as failed.
* **Status Tracking**: Each notification can be `pending`, `sent`, or `failed`.
* **Extensibility**: Easily add new notification channels by extending service modules.

---

### Technology Stack

* **Node.js & Express**: REST API and core business logic.
* **PostgreSQL**: Persistent storage for users and notifications.
* **RabbitMQ**: Message broker for reliable, asynchronous task handling.
* **amqplib**: RabbitMQ client library for Node.js.
* **Nodemailer**: Email delivery.
* **Twilio**: SMS messaging.

---

### Prerequisites

* **Node.js** v14+ and npm
* **PostgreSQL** (local or remote)
* **RabbitMQ** (installed and running locally)

---

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Aditya2661/Notification-Service.git
   cd Notification-Service
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file at the project root:

   ```dotenv
   DATABASE_URL=postgres://<DB_USER>:<DB_PASS>@localhost:5432/<DB_NAME>
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=465
   EMAIL_USER=your@email.com
   EMAIL_PASS=your_email_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890
   RABBITMQ_URL=amqp://localhost
   PORT=3000
   ```

4. **Apply Database Migrations**

   ```bash
   npx knex migrate:latest
   ```

5. **Start RabbitMQ**
   Ensure RabbitMQ is running locally:

   ```bash
   rabbitmqctl status
   ```

   Optionally, access the management UI at `http://localhost:15672` (user: `guest`, password: `guest`).

6. **Launch the API Server**

   ```bash
   node src/app.js
   ```

7. **Run the Notification Worker**
   In a separate terminal:

   ```bash
   node src/workers/notificationWorker.js
   ```

---

### API Endpoints

#### Send a Notification

`POST /notifications`

```json
{
  "userId": 1,               // optional if email is provided
  "email": "user@example.com", // required if userId is omitted
  "phone": "1234567890",       // optional
  "type": "email",             // one of: "email", "sms", "in-app"
  "message": "Your message"
}
```

#### Retrieve User Notifications

`GET /users/:id/notifications`

Example:

```bash
GET /users/1/notifications
```

---

### How It Works

1. **Request**: A notification request is saved in PostgreSQL with `pending` status.
2. **Queue**: The message is added to a RabbitMQ queue.
3. **Processing**: The worker consumes the queue and attempts delivery via the specified channel.
4. **Retry**: On failure, the worker retries up to 5 times with configurable delays.
5. **Update**: Status in the database is updated to `sent` or `failed`.

---

### Project Structure

```
src/
├── config/                # Database configuration
├── routes/                # Express route handlers
├── services/              # Channel-specific logic (Email, SMS, In-App, Queue)
├── workers/               # RabbitMQ consumer and retry logic
├── app.js                 # Entry point for the Express application
migrations/                # Knex migration files
.env                       # Environment variables
```

---

### Customization

* **Add Channels**: Create a new module in `src/services/` and integrate with the worker logic.
* **Adjust Retries**: Modify retry count and backoff settings in the worker.
* **Extend API**: Add new endpoints or middleware as needed.

---

### Troubleshooting

* **RabbitMQ Connection Issues**: Verify the `RABBITMQ_URL` and ensure the broker is running.
* **Push to GitHub Rejected**: Check for branch protection rules or sensitive data in commits.
* **Delivery Failures**: Confirm your SMTP and Twilio credentials, and network connectivity.

---

### References

* [RabbitMQ Documentation](https://www.rabbitmq.com/)
* [amqplib on GitHub](https://github.com/amqp-node/amqplib)
* [Nodemailer](https://nodemailer.com/)
* [Twilio SMS API](https://www.twilio.com/docs/sms)

---

*License: This project is provided for educational and demonstration purposes.*
