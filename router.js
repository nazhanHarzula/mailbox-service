const Router = require('express').Router();

const mailboxRoute = require('./api/mailbox');

Router.use('/mailbox', mailboxRoute);

module.exports = Router;