# Saylani Mass IT Training - Smart Assistant

Welcome to the Saylani Mass IT Training Smart Assistant project! This repository contains the code for a Dialogflow webhook that collects user information and sends a formatted email using Node.js, Express, and Nodemailer. The smart assistant is integrated into the "Saylani Mass IT Training" web page, a clone website designed to provide training and educational resources.

## Table of Contents

- [Website Overview](#website-overview)
- [Bot Overview](#bot-overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [How it Works](#how-it-works)
- [Benefits](#benefits)
- [Contributing](#contributing)
- [License](#license)

## Website Overview

"Saylani Mass IT Training" is a clone website designed to mimic the functionalities and services of the Saylani Welfare International Trust's IT training programs. The website provides information about various IT courses, enrollment procedures, and resources for students.

### Key Features

- **Course Listings**: Detailed information about various IT courses offered.
- **Enrollment Forms**: Online forms to collect user information for course registration.
- **Resource Access**: Educational resources and materials for enrolled students.
- **Smart Assistant**: Integrated chatbot to assist users with inquiries and course registration.

## Bot Overview

The smart assistant integrated into the "Saylani Mass IT Training" website helps users to:
- Collect personal information required for course registration.
- Provide information about available courses.
- Assist with general inquiries related to the IT training programs.

## Features

- **Collect User Information**: Collects information such as name, father's name, date of birth, gender, CNIC number, course of interest, phone number, and email.
- **Formatted Email**: Sends an email with the collected information in a well-structured HTML format.
- **Dialogflow Integration**: Seamlessly integrates with Dialogflow to handle user interactions.
- **Environment Configuration**: Uses environment variables to manage sensitive data.

## Requirements

- Node.js (v12 or higher)
- NPM (Node Package Manager)
- A Gmail account with less secure app access enabled or an app-specific password.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/saylani-mass-it-training.git
    cd saylani-mass-it-training
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Gmail credentials:
    ```env
    PORT=3000
    GMAIL_USER=your-email@gmail.com
    GMAIL_PASS=your-password
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. Your server will be running on `http://localhost:3000`.

3. Configure your Dialogflow agent to point to the `/webhook` endpoint of your server.

## Code Explanation

### Server Setup

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { WebhookClient } = require('dialogflow-fulfillment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
Express: Sets up the server.
Body-Parser: Parses incoming JSON requests.
Nodemailer: Configures the email transport.
Dialogflow-Fulfillment: Handles Dialogflow webhook requests.
dotenv: Loads environment variables from a .env file.
Email Transporter
javascript
Copy code
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});
Configures the transporter for sending emails via Gmail.
Webhook Endpoint
javascript
Copy code
app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
Defines the webhook endpoint to handle POST requests from Dialogflow.
Collect User Info Intent
javascript
Copy code
function collectUserInfo(agent) {
  // Extracts and processes user information
  // Sends formatted email with user info
}
Processes parameters received from Dialogflow.
Formats user information and constructs the email content.
Sends the email using Nodemailer.
Intent Mapping
javascript
Copy code
const intentMap = new Map();
intentMap.set('Collect_User_Info', collectUserInfo);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Default Welcome Intent', welcome);

agent.handleRequest(intentMap);
Maps intents to their corresponding functions to handle requests.
How it Works
User Interaction: The user interacts with the Dialogflow agent and provides their information.
Webhook Request: Dialogflow sends the collected data to the webhook endpoint.
Process Data: The server processes the data and constructs an email.
Send Email: The server sends a formatted email with the user information to the provided email address.
Response to User: The user receives a confirmation message indicating the form has been submitted successfully.
Benefits
Automated Information Collection: Streamlines the process of collecting user information.
Well-Formatted Emails: Ensures the collected data is presented in a clear and professional manner.
Seamless Integration: Easily integrates with Dialogflow for conversational interactions.
Secure Configuration: Manages sensitive data using environment variables.
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

License
This project is licensed under the MIT License. See the LICENSE file for details.
