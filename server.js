require("dotenv").config();

const connectDB = require("./src/config/db");
const createAdminIfNotExists = require("./src/utils/createAdminIfNotExists");

const http = require("http");
const app = require("./src/app");

const PORT = process.env.PORT || 8080;


const startServer = async () => {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Create admin AFTER DB is ready
    await createAdminIfNotExists();

    // 3. Start server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();