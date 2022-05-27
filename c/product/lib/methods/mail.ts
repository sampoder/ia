const nodemailer = require("nodemailer");
const { exec } = require("child_process");

export default async function mail(config: object) {
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
