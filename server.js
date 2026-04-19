const connectDB = require('./src/config/db');
require("dotenv").config();
const http=require('http')
const app = require('./src/app')

const PORT=process.env.PORT || 8080;
connectDB();
const server=http.createServer(app);


server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});