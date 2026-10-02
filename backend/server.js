const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "MahaSetu Backend is Running 🚀"
  });
});

// Application routes
app.use("/api/applications", applicationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`MahaSetu Backend running on http://localhost:${PORT}`);
});