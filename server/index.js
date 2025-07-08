const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { initDB } = require('./config/database');
const authRoutes = require("./routes/Auth.routes");
const userRoutes = require("./routes/User.routes");
const platformRoutes = require("./routes/platform.routes");


const PORT = process.env.PORT || 4000;
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/platform", platformRoutes);

app.get('/', (req, res) => {
  res.send('Codash Backend is Running!');
});

// Initialize CouchDB
initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
