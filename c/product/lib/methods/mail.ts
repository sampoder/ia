/* This file exports a function that sends an email and 
if in development mode, provides a preview of that email. */

export default async function mail(config: object) {
  let exec;
  let nodemailer
  if(typeof window === 'undefined'){
    exec = require("child_process").exec;
    nodemailer = require("nodemailer");
  }
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  let info = await transporter.sendMail(config);
  console.log("Message sent: %s", info.messageId);
  console.log(
    "Preview URL: %s",
    nodemailer
      .getTestMessageUrl(info)
      .replace(
        "https://ethereal.email/message/",
        "http://localhost:3000/api/emails/"
      )
  );
  exec(
    "open " +
      nodemailer
        .getTestMessageUrl(info)
        .replace(
          "https://ethereal.email/message/",
          "http://localhost:3000/api/emails/"
        )
  );
  return nodemailer.getTestMessageUrl(info);
}
