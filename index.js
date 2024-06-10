const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { WebhookClient } = require('dialogflow-fulfillment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  function formatCNIC(cnic) {
    const cnicStr = cnic.toString();
    return `${cnicStr.slice(0, 5)}-${cnicStr.slice(5, 12)}-${cnicStr.slice(12)}`;
  }

  function collectUserInfo(agent) {
    console.log('Dialogflow Parameters:', agent.parameters);

    const person = agent.parameters['person'];
    const any = agent.parameters['any'];
    const date = agent.parameters['date'];
    const gender = agent.parameters['gender'];
    const number = agent.parameters['number'];
    const course = agent.parameters['course'];
    const phoneNumber = agent.parameters['phone-number'];
    const email = agent.parameters['email'];

    const formattedDate = date ? formatDate(date) : 'N/A';
    const formattedCNIC = number ? formatCNIC(number) : 'N/A';

    const emailContent = `
      <html>
        <head>
          <style>
            body {
              background-color: #f0f2f5;
              font-family: 'Arial', sans-serif;
            }
            .card-container {
              max-width: 600px;
              margin: auto;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              padding: 20px;
              background-color: #ffffff;
              font-family: 'Roboto', sans-serif;
              text-align: center;
              color: #333;
            }
            .card-container h1 {
              color: #007bff;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
              font-size: 2em;
              margin-bottom: 20px;
            }
            .card-container img {
              margin: 20px 0;
            }
            .card-container h2 {
              color: #343a40;
              margin-bottom: 20px;
              font-size: 1.5em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 1em;
            }
            table, th, td {
              border: 1px solid #dee2e6;
            }
            th, td {
              padding: 12px;
              text-align: left;
              font-family: 'Open Sans', sans-serif;
            }
            th {
              background-color: #007bff;
              color: #ffffff;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #e9ecef;
            }
            a {
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
            }
            @media (max-width: 600px) {
              .card-container {
                padding: 10px;
              }
              table, th, td {
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="card-container">
            <h1>Saylani Welfare International Trust</h1>
            <img src="https://www.saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" alt="Saylani Logo" width="100">
            <h2>User Information</h2>
            <table>
              <tr>
                <th>Name</th>
                <td>${person ? person.name : 'N/A'}</td>
              </tr>
              <tr>
                <th>Father's Name</th>
                <td>${any || 'N/A'}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>${formattedDate}</td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>${gender || 'N/A'}</td>
              </tr>
              <tr>
                <th>CNIC Number</th>
                <td>${formattedCNIC}</td>
              </tr>
              <tr>
                <th>Course</th>
                <td>${course || 'N/A'}</td>
              </tr>
              <tr>
                <th>Mobile Number</th>
                <td>${phoneNumber || 'N/A'}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>${email || 'N/A'}</td>
              </tr>
            </table>
            <p>For more information, visit <a href="https://www.saylaniwelfare.com/en/">Saylani Welfare International Trust</a></p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Saylani Welfare International Trust - User Information',
      html: emailContent
    };

    return transporter.sendMail(mailOptions)
      .then(info => {
        console.log('Email sent: ' + info.response);
        agent.add('The form has been submitted successfully. Please check your email.');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        agent.add('There was an error sending the email. Please try again.');
      });
  }

  function fallback(agent) {
    agent.add("I'm sorry, I couldn't understand your request. Let me transfer you to Gemini for assistance.");
  }

  function welcome(agent) {
    agent.add("Hello! Welcome to Saylani Welfare International Trust. I'm your smart assistant. I can help you to sign up. Can you please provide your information?");
  }

  const intentMap = new Map();
  intentMap.set('Collect_User_Info', collectUserInfo);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Default Welcome Intent', welcome);

  agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
