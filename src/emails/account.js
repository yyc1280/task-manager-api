const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.APIKEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email ,
    from: "foos1280@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to the app, ${name}`,
  });
};

const sendByeeEmail = (email, name) => {
  sgMail.send({
    to: email ,
    from: "foos1280@gmail.com",
    subject: "Sorry to see you go",
    text: `Ferewell, ${name}`,
  });
};

module.exports = { sendWelcomeEmail ,sendByeeEmail};
