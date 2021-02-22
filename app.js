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
      port: 465,
      secure: true,
      auth: {
          user: process.env.ZOHO_UN, 
          pass: process.env.ZOHO_PW, 
      },
    });

    await transporter.sendMail({
        from: `Code Nguyen <${process.env.ZOHO_UN}>`, // sender address
        to: process.env.ZOHO_UN, // list of receivers
        subject: "New message from the Code Nguyen contact form.", // Subject line
        html: output, // html body
    }, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ status: "Message failed. Check nodemailer error." });
      } else {
        console.log(info);
        res.json(info);
      }
    });
  };

  main().catch(console.error);

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});