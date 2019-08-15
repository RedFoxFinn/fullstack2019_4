if (process.argv[0] !== 'production') {
  require('dotenv').config();
}

const MONGODB_URI = process.argv[0] === 'production' ? process.env.MONGODB_URI : process.env.TEST_MONGODB_URI;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI, PORT, SECRET
};