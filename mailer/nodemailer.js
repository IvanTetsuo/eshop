const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.mail.ru',
        port: 465,
        auth: {
            user: 'for.test.node.mailer@mail.ru',
            pass: '7tmeL97WuzXeqAmmWmqH'
        }
    },
    {
        from: 'Mailer Test <for.test.node.mailer@mail.ru>'
    }
);

// async function mailer (message) {
//     return transporter.sendMail(message);
// };

module.exports = transporter;