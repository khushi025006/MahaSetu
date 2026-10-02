// Mock Government API
// Simulates different government department systems.

const submitGovernmentApplication = async (applicationData) => {

  console.log("🏛️ Sending data to Government Department API...");
  console.log("Government API Data:", applicationData);

  const schemeName =
    applicationData.scheme?.name ||
    "Government Service";

  const department =
    applicationData.scheme?.department ||
    "General Government Department";

  // Generate application ID prefix
  let prefix = "GOV";

  if (schemeName.toLowerCase().includes("scholarship")) {

    prefix = "GOV-SCH";

  } else if (
    schemeName.toLowerCase().includes("employment")
  ) {

    prefix = "GOV-EMP";

  } else if (
    schemeName.toLowerCase().includes("welfare")
  ) {

    prefix = "GOV-WEL";

  } else if (
    schemeName.toLowerCase().includes("education")
  ) {

    prefix = "GOV-EDU";
  }

  // Generate government application ID
  const governmentApplicationId =
    prefix +
    "-" +
    Math.floor(10000 + Math.random() * 90000);

  return {

    success: true,

    governmentApplicationId:
      governmentApplicationId,

    status: "SUBMITTED",

    scheme: schemeName,

    department: department,

    message:
      `Application successfully received by ${department}`
  };
};

module.exports = {
  submitGovernmentApplication
};