/* eslint-disable no-console */
const sendGridEmail = require('@sendgrid/mail');
sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY);
const path = require('path');
const mustache = require('mustache');
const fs = require('fs');

async function SendMailAPI(addResult, documentNo,loggedInUser,recipients) {
  try {
    const templatePath = path.join(__dirname, '..', 'template', 'index.html');
    const view = {
      documentId: addResult,
      loggedInUser:loggedInUser,
      documentNo: documentNo,
      deleteDocumentLink: process.env.REMOTE_BASE_URL + `/dashboard/document/deleterequest/delete/delete/${addResult}`,
    };

    const htmlContent = mustache.render(fs.readFileSync(templatePath, 'utf8'), view);

    const mailOptions = {
      from: process.env.SENDGRID_FROM,
      to: recipients,
      subject: 'Welcome to Sync Opp',
      html: htmlContent,
    };

    const result = await sendGridEmail.send(mailOptions);
    return { message: 'Email Sent Successfully!', result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Error sending email', details: error };
  }
}

module.exports = { SendMailAPI };
