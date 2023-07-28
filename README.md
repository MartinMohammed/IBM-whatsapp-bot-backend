[![Checks](https://github.com/body-culture/webhook-api/actions/workflows/checks.yaml/badge.svg)](https://github.com/body-culture/webhook-api/actions/workflows/checks.yaml)

# Fitness App Suite

Welcome to the Fitness App Suite, a collection of applications developed during my internship at IBM in collaboration with the Body Culture Group in Darmstadt. This suite includes the Gym Occupancy Tracker, a Svelte Frontend Dashboard, a Webhook API Server, an Authorization Server with JWT, and the successful WhatsApp Middleware npm package.

## Overview

During my internship at IBM, I took on the role of Product Owner for a project in collaboration with the Body Culture Group in Darmstadt. Body Culture is a prominent player in the fitness industry with over 300 employees in Hessen and multiple sub-brands, dominating the market in the Rhine-Main Area.

As part of my responsibilities, I led the design of a comprehensive AWS Cloud Infrastructure. This involved various tasks such as networking with VPCs and implementing essential services like API Gateway and DynamoDB. To achieve rapid and efficient cloud infrastructure deployment and updates, I utilized the Cloud Development Kit as an Infrastructure as Code technology.

The primary focus of the project was to integrate a custom WhatsApp Chatbot using the Meta WhatsApp Cloud API. To accomplish this, I developed a fully functional WhatsApp Dashboard using Svelte, a high-speed JavaScript Framework. For the backend, I employed REST API and WebSockets for real-time message communication. Security was a crucial aspect, and I ensured robust protection by implementing JWT authentication and leveraging AWS Cognito service to safeguard the API Gateway.

The success of the WhatsApp Chatbot was impressive, as it garnered widespread interest and achieved over 4000 weekly downloads on NPM within the first two weeks of its release. Additionally, I integrated the WhatsAppBot with Google's Dialogflow, allowing the bot to utilize artificial intelligence to respond to user messages in the fitness studios. This innovative approach effectively transformed customer service from traditional telephone communication to fully automated interactions via WhatsAppBot, resulting in increased conversion rates for new customer sign-ups. Users could easily share the WhatsApp business account with friends, while the bot handled all membership-related information, including scheduling a suitable slot within a week.

### Quick navigation 



- [Svelte Frontend Dashboard Repository](https://github.com/MartinMohammed/IBM-whatsapp-bot-frontend)
- [Authorization Server Repository](https://github.com/MartinMohammed/IBM-jwt-authorization)
- [Gym Occupancy Tracker Repository](https://github.com/MartinMohammed/IBM-whatsapp-occupancy-scraper)
- [WhatsApp Middleware NPM Package](https://github.com/MartinMohammed/IBM-whatsapp-bot-middleware-npm)

## Gym Occupancy Tracker

The Gym Occupancy Tracker is a Python program that web-scrapes the Fitness Fabrik gym website to extract data about the current number of people training in the gym. It uses Beautiful Soup to parse the HTML and extract relevant data. The program also integrates with a Telegram bot to notify users when the gym occupancy meets their desired criteria.

[Link to Gym Occupancy Tracker Repository](https://github.com/MartinMohammed/IBM-whatsapp-occupancy-scraper)

## Svelte Frontend Dashboard

The Svelte Frontend Dashboard is a web application designed for the CRS team to interact with gym members and facilitate automated WhatsApp customer service. Built with Svelte, it utilizes websockets to fetch real-time data from the backend, including recent WhatsApp messages. The production version includes a permission system, enabling admin privileges and integration with Google's Dialogflow chatbot AI.

![Login Screen](https://github.com/MartinMohammed/whataspp-dashboard-svelte/assets/81469658/9cc033d6-48c3-4efd-bd2d-b81fce6df6c3.png)

![Chat Screen](https://github.com/MartinMohammed/whataspp-dashboard-svelte/assets/81469658/377f62d9-581f-4230-b6c0-e3f20f5a4c23.png)
## WhatsApp Backend Server


# Project Overview - Whatsapp ChatBot / Dashboard Application

This section represents the public demo backend version of the Whatsapp ChatBot / dashboard application developed during my time at IBM. As the product owner for the project with Body Culture Group in Darmstadt, my responsibilities included overseeing the development and implementation of the backend server. The server consists of a REST API and a web socket server that enables the delivery of messages to the frontend. To ensure security, the API routes are protected using a JWT authorization mechanism, with tokens provided by the authorization server. Additionally, the server utilizes the public demo version of the WhatsApp middleware developed by myself, which allows for the receiving and subscribing to new incoming WhatsApp messages.

The Webhook API is an HTTP-based API designed to facilitate the receipt and processing of incoming messages from WhatsApp. This documentation provides an overview of the API endpoints, request/response formats, and examples demonstrating how to interact with the API.

### Base URL

The base URL for the Webhook API is `https://your-domain.com/webhook`.

### Endpoints

#### `GET /webhook`

This endpoint is used to verify the callback URL from the WhatsApp dashboard. It should be called with the following query parameters:

- `hub.mode`: The mode of the webhook subscription. Set it to "subscribe".
- `hub.challenge`: A random string generated by WhatsApp for verification.
- `hub.verify_token`: The verification token provided by WhatsApp.

##### Request Example

```
GET /webhook?hub.mode=subscribe&hub.challenge=123456789&hub.verify_token=your-verification-token
```

##### Response Example

```
Status: 200 OK

123456789
```

#### `POST /webhook`

This endpoint is used to receive incoming messages from WhatsApp. The payload of the request will contain the details of the received message.

##### Request Example

```
POST /webhook

{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "+1234567890",
              "phone_number_id": "987654321"
            },
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                },
                "wa_id": "1234567890"
              }
            ],
            "messages": [
              {
                "from": "1234567890",
                "id": "987654321",
                "timestamp": 1654321000,
                "type": "text",
                "text": {
                  "body": "Hello, World!"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

##### Response Example

```
Status: 200 OK
```

### Error Handling

If there is an error during the processing of a request, the API will respond with an appropriate HTTP status code and an error message in the response body.

### Libraries and Dependencies

The Webhook API is built using the following libraries and dependencies:

- Express.js: A fast and minimalist web framework for Node.js.
- body-parser: Middleware for parsing JSON requests.
- nodemon: Development tool that automatically restarts the server when code changes are detected.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.

### Development Workflow

To set up the development environment and start the webhook API, follow these steps:

1. Clone the repository: `git clone https://github.com/https://github.com/MartinMohammed/IBM-whatsapp-bot-backend.git`
2. Install dependencies: `npm ci`
3. Start the development server: `npm run dev`

### Deployment

To deploy the webhook API to a production environment, follow these steps:

1. Build the application: `npm run build`
2. Set the necessary environment variables, such as the `PORT` and `VERIFY_TOKEN`.
3. Deploy the application to your hosting provider of choice.

### Conclusion

The Webhook API provides a seamless integration with WhatsApp, allowing you to receive and process messages from users. By following this documentation, you can easily set up and deploy the webhook API for your application.


## Authorization Server with JWT

The Authorization Server with JWT is a secure authentication service that allows users to register, login, and manage their authentication tokens. It provides endpoints for user registration, user login, refreshing access tokens, and logging out. The API uses JWTs for authentication and Redis for managing refresh tokens.

[Link to Authorization Server Repository](https://github.com/MartinMohammed/IBM-jwt-authorization)

# WhatsApp Middleware NPM Package

The WhatsApp Middleware Package is a highly successful npm package developed during my internship at IBM. It serves as a crucial component of the Fitness App Suite, enabling seamless integration with the WhatsApp Chatbot and real-time message communication.

[Link to WhatsApp Middleware NPM package](https://github.com/MartinMohammed/IBM-whatsapp-bot-middleware-npm)

## Conclusion

The Fitness App Suite brings together a range of applications to improve the fitness experience for users and streamline customer service. Each application serves a specific purpose in the overall ecosystem, offering features such as gym occupancy tracking, real-time notifications, and secure authentication.

Feel free to explore each application's repository for more details and contributions. If you have any questions or suggestions, don't hesitate to reach out. Happy coding!

