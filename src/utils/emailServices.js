/* eslint-disable no-console */
const sendGridEmail = require("@sendgrid/mail");
sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY);
const path = require("path");
const mustache = require("mustache");
const fs = require("fs");
const nodemailer = require("nodemailer");

async function SendMailAPI(addResult, documentNo, loggedInUser, recipients) {
    try {
        const templatePath = path.join(
            __dirname,
            "..",
            "template",
            "index.html",
        );
        const view = {
            documentId: addResult,
            loggedInUser: loggedInUser,
            documentNo: documentNo,
            deleteDocumentLink:
                process.env.REMOTE_BASE_URL +
                `/dashboard/document/deleterequest/delete/delete/${addResult}`,
        };

        const htmlContent = mustache.render(
            fs.readFileSync(templatePath, "utf8"),
            view,
        );

        const mailOptions = {
            from: process.env.SENDGRID_FROM,
            to: recipients,
            subject: "Welcome to Sync Opp",
            html: htmlContent,
        };

        const result = await sendGridEmail.send(mailOptions);
        return { message: "Email Sent Successfully!", result };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: "Error sending email", details: error };
    }
}


async function sendEmailForProfessionalAccount(body) {
    console.log("Body : ", body);
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587, 
            secure: false,
            auth: {
                user: process.env.APP_MAIL,
                pass: process.env.APP_MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Data Geometry" <${process.env.APP_MAIL}>`,
            to: `${body.email}`,
            subject: "Professional Account Activation - Data Geometry",
            cc: ["shashank@sdlccorp.com", "piyush@sdlccorp.com"],
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Account Activation - Data Geometry</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
      }
      .container {
          max-width: 600px;
          margin: auto;
          background-color: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
          font-size: 20px;
          text-align: center;
      }
      .content {
          margin-top: 20px;
      }
      .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">Professional Account Activation</div>
      <div class="content">
          <p>Hello ,</p>
          <p>You have received a professional account request with the following details:</p>
          <ul>
              <li>Name: ${body.name}</li>
              <li>Email:  ${body.email}</li>
              <li>Phone:  ${body.phone}</li>
              <li>Organization Name: ${body.orgName}</li>
              <li>Comment:  ${body.comment ? body.comment :""}</li>
          </ul>
          <p>Best Regards,</p>
          <p>Your Team</p>
      </div>
      <div class="footer">
          This is an automated message, please do not reply directly to this email.
      </div>
  </div>
</body>
</html>
`,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { message: "Email Sent Successfully!", result: info, status: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: "Error sending email", details: error, status: false };
    }
}

module.exports = { SendMailAPI, sendEmailForProfessionalAccount };
