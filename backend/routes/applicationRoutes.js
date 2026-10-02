const express = require("express");

const router = express.Router();

const {
  submitApplication
} = require("../services/integrationService");

router.post("/submit", async (req, res) => {
  try {
    console.log("📥 Application received from frontend");

    const applicationData = req.body;

    console.log("Application Data:", applicationData);

    const result = await submitApplication(applicationData);

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data: result
    });

  } catch (error) {
    console.error("❌ Application submission error:", error);

    res.status(500).json({
      success: false,
      message: "Application submission failed",
      error: error.message
    });
  }
});

module.exports = router;