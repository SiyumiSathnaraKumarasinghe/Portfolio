const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Handle form submission
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate data
  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Set up email transport using environment variables
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Loaded from .env
        pass: process.env.EMAIL_PASS, // Loaded from .env
      },
    });

    // Email details
    const mailOptions = {
      from: email, // The sender's email (user's input)
      to: process.env.EMAIL_USER, // Your email to receive messages
      subject: `Hiring Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send message.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
