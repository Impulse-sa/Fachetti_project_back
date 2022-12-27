const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const msg = {
  to: 'lautarohconti@gmail.com', // Change to your recipient
  from: 'impulsesa10@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })