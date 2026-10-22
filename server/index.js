require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log('Server running on port ' + port);
  if (process.env.ENABLE_SMTP_CONTACT === 'true') await require('./config/email').verifyConnection();
});
