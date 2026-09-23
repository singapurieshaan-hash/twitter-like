require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/chirp";
const SECRET = process.env.SECRET || "dev-secret-change-me";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

module.exports = { PORT, MONGODB_URI, SECRET, CLIENT_URL };
