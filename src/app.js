const express = require("express");
const mongoose = require("mongoose");
const xmlparser = require("express-xml-bodyparser");
require("dotenv").config();
const homeownerRoutes = require("./routes/homeownerRoutes");

const app = express();

// Middleware to parse XML request bodies
app.use(xmlparser());
app.use(express.json());
app.use("/homeowners", homeownerRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DBURI);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections (for example, MongoDB connection issues)
process.on("unhandledRejection", (error, promise) => {
  console.error(`Error: ${error.message}`);
  // Close the server and exit the process
  server.close(() => process.exit(1));
});

module.exports = server;
