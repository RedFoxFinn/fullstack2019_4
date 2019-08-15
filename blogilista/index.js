const config = require('./utils/config.js');
const http = require('http');
const mongoose = require('mongoose');
const api = require('./controllers/apiController.js');
const logger = require('./utils/logger.js');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    logger.info('Connection to Atlas - MongoDB cloud: success');
  })
  .catch(() => {
    logger.error('Connection to Atlas - MongoDB cloud: failed');
  });

const apiServer = http.createServer(api);

apiServer.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});