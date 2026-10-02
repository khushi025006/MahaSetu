const {
  submitGovernmentApplication
} = require("./governmentApi");

const submitApplication = async (applicationData) => {
  console.log("🔄 MahaSetu Integration Layer");

  // Standardize citizen data
  const standardizedData = {
    name: applicationData.name || "",
    mobile: applicationData.mobile || "",
    email: applicationData.email || "",
    education: applicationData.education || "",
    address: applicationData.address || "",
    income: applicationData.income || "",

    // Standardize government service
    scheme: {
      name:
        applicationData.scheme?.name ||
        "Government Service",

      department:
        applicationData.scheme?.department ||
        "General Government Department",

      match:
        applicationData.scheme?.match || null
    }
  };

  console.log("📦 Standardized MahaSetu Data:");
  console.log(standardizedData);

  // Send standardized data to Government API
  const response =
    await submitGovernmentApplication(standardizedData);

  return response;
};

module.exports = {
  submitApplication
};