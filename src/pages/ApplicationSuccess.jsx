import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ApplicationSuccess() {

  // Get application data saved after submission
  const savedApplication =
    JSON.parse(localStorage.getItem("lastApplication") || "null");

  // Government application ID from backend
  const applicationId =
    savedApplication?.governmentApplicationId ||
    localStorage.getItem("applicationId") ||
    "Processing...";

  const schemeName =
    savedApplication?.scheme ||
    "Government Scholarship";

  const department =
    savedApplication?.department ||
    "Education Department";

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2 className="logo">MahaSetu</h2>

        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>

          <Link to="/services">
            🏛️ Government Services
          </Link>

          <Link to="/ai-scheme-finder">
            🤖 AI Scheme Finder
          </Link>

          <Link to="/applications">
            📋 My Applications
          </Link>

          <Link to="/documents">
            📄 Documents
          </Link>

          <Link to="/consent-manager">
            🔐 Consent Manager
          </Link>

          <Link to="/notifications">
            🔔 Notifications
          </Link>

          <Link to="/profile">
            👤 Profile Settings
          </Link>
        </nav>

      </aside>


      {/* Main Content */}
      <main className="main-content">

        <section className="success-page">

          {/* Success Icon */}
          <div className="success-icon">
            ✓
          </div>


          {/* Heading */}
          <h1>
            Application Submitted Successfully!
          </h1>

          <p className="success-message">
            Your application has been successfully
            submitted through MahaSetu.
          </p>


          {/* Application Information */}
          <div className="application-id-box">

            <p>Government Application ID</p>

            <h2>
              {applicationId}
            </h2>

            <span>
              Keep this ID safe for tracking your application.
            </span>

          </div>


          {/* Scheme Information */}
          <div className="success-scheme-info">

            <div>
              <span>🎓</span>

              <div>
                <strong>{schemeName}</strong>

                <p>
                  {department}
                </p>
              </div>
            </div>

            <span className="success-status">
              SUBMITTED
            </span>

          </div>


          {/* Interoperability Journey */}
          <div className="interoperability-card">

            <div className="interoperability-heading">

              <div>
                <h2>
                  🔗 MahaSetu Interoperability Journey
                </h2>

                <p>
                  How your application moved between
                  MahaSetu and the government department.
                </p>
              </div>

            </div>


            {/* Step 1 */}
            <div className="integration-step completed">

              <div className="integration-icon">
                ✓
              </div>

              <div className="integration-content">

                <strong>
                  Citizen Data Collected
                </strong>

                <p>
                  Your profile information was collected
                  from MahaSetu.
                </p>

              </div>

            </div>


            <div className="integration-line"></div>


            {/* Step 2 */}
            <div className="integration-step completed">

              <div className="integration-icon">
                ✓
              </div>

              <div className="integration-content">

                <strong>
                  Data Standardized
                </strong>

                <p>
                  MahaSetu converted citizen data into a
                  common standardized format.
                </p>

              </div>

            </div>


            <div className="integration-line"></div>


            {/* Step 3 */}
            <div className="integration-step completed">

              <div className="integration-icon">
                ✓
              </div>

              <div className="integration-content">

                <strong>
                  Consent Verified
                </strong>

                <p>
                  Citizen consent was verified before
                  sharing information with the department.
                </p>

              </div>

            </div>


            <div className="integration-line"></div>


            {/* Step 4 */}
            <div className="integration-step completed">

              <div className="integration-icon">
                ✓
              </div>

              <div className="integration-content">

                <strong>
                  Government API Connected
                </strong>

                <p>
                  Application data was sent through the
                  MahaSetu integration layer.
                </p>

              </div>

            </div>


            <div className="integration-line"></div>


            {/* Step 5 */}
            <div className="integration-step completed">

              <div className="integration-icon">
                ✓
              </div>

              <div className="integration-content">

                <strong>
                  Application Created
                </strong>

                <p>
                  {department} successfully received
                  your application.
                </p>

              </div>

            </div>

          </div>


          {/* Buttons */}
          <div className="success-actions">

            <Link
              to="/dashboard"
              className="primary-success-button"
            >
              Go to Dashboard
            </Link>

            <Link
              to="/applications"
              className="secondary-success-button"
            >
              Track Application
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ApplicationSuccess;