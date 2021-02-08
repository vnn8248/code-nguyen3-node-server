require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extend: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, welcome to the Code Nguyen API.");
});

app.post("/", (req, res) => {
  console.log(req.body);

  async function main() {
    const output = `
      <h1>You've received a new message.</h1>
      <h2>From: ${req.body.name}</h2>
      <h2>Email: ${req.body.email}</h2>
      <p>Message: ${req.body.message}</P>
    `;

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: process.env.ZOHO_PORT,
      secure: true,
      auth: {
          user: process.env.ZOHO_UN, 
          pass: process.env.ZOHO_PW, 
      },
    });

    const info = await transporter.sendMail({
        from: process.env.ZOHO_UN, // sender address
        to: process.env.ZOHO_UN, // list of receivers
        subject: "New message from the Code Nguyen contact form.", // Subject line
        html: output, // html body
    }, (error) => {
      if (error) {
        res.json({ status: "failed" });
      } else {
        res.json({ status: "sent" });
      }
    });
  };

  main().catch(console.error);

});

app.listen(5000, () => {
  console.log("The server is running on port 5000");
});