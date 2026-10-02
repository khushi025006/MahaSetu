import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../App.css";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 REAL-TIME APPLICATION LISTENER
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    const applicationsRef = collection(db, "applications");

    const applicationsQuery = query(
      applicationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        const applicationList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApplications(applicationList);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Application Firebase Error:",
          error
        );

        setLoading(false);
      }
    );

    // Stop listener when leaving page
    return () => unsubscribe();
  }, [navigate]);

  // Format Firebase timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Processing...";
    }

    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    }

    return "Processing...";
  };

  // Get progress based on application status
  const getProgress = (status) => {
    const currentStatus = status || "SUBMITTED";

    if (currentStatus === "APPROVED") {
      return 4;
    }

    if (currentStatus === "REJECTED") {
      return 4;
    }

    if (currentStatus === "UNDER_REVIEW") {
      return 4;
    }

    return 3;
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>📋 Loading Applications...</h2>
          <p>
            Fetching your applications from MahaSetu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <span>🌐</span>
          MahaSetu
        </div>

        <nav>
          <a href="/dashboard">🏠 Dashboard</a>

          <a href="/services">
            🏛️ Government Services
          </a>

          <a href="/ai-scheme-finder">
            🤖 AI Scheme Finder
          </a>

          <a
            href="/applications"
            className="active-menu"
          >
            📋 My Applications
          </a>

          <a href="/documents">
            📁 Documents
          </a>

          <a href="/consent-manager">
            🔐 Consent Manager
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

          <a href="/profile">
            👤 Profile Settings
          </a>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="dashboard-header">

          <div className="header-search">
            🔍

            <input
              type="text"
              placeholder="Search services..."
            />
          </div>

          <div className="header-right">
            🌐 English
            <span>🔔</span>
            <span>
              👤 {applications[0]?.applicant?.name || "Citizen"}
            </span>
          </div>

        </header>

        {/* Applications */}
        <section className="applications-page">

          <div className="applications-heading">

            <div>
              <span className="page-label">
                APPLICATIONS
              </span>

              <h1>My Applications</h1>

              <p>
                Track all your government service
                applications from one place.
              </p>
            </div>

            <button
              className="new-application-button"
              onClick={() => navigate("/services")}
            >
              + New Application
            </button>

          </div>

          {/* No Applications */}
          {applications.length === 0 && (
            <div className="application-info-box">

              <div className="info-box-icon">
                📭
              </div>

              <div>
                <h3>
                  No Applications Yet
                </h3>

                <p>
                  Your government service applications
                  will appear here.
                </p>
              </div>

            </div>
          )}

          {/* REAL-TIME APPLICATIONS */}
          {applications.map((application) => {

            const status =
              application.status || "SUBMITTED";

            const progress =
              getProgress(status);

            return (
              <div
                className="application-card"
                key={application.id}
              >

                {/* Application Header */}
                <div className="application-card-header">

                  <div className="application-service">

                    <div className="application-icon">
                      🎓
                    </div>

                    <div>
                      <h2>
                        {application.service ||
                          "Government Scholarship"}
                      </h2>

                      <p>
                        {application.department ||
                          "Education Department"}
                      </p>
                    </div>

                  </div>

                  <span className="application-status">
                    {status}
                  </span>

                </div>

                {/* Application Information */}
                <div className="application-info">

                  <div>
                    <span>
                      Application ID
                    </span>

                    <strong>
                      {application.governmentApplicationId ||
                        application.id}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Submitted On
                    </span>

                    <strong>
                      {formatDate(
                        application.createdAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Service
                    </span>

                    <strong>
                      Scholarship
                    </strong>
                  </div>

                  <div>
                    <span>
                      Department
                    </span>

                    <strong>
                      Education
                    </strong>
                  </div>

                </div>

                {/* Progress */}
                <div className="application-progress">

                  <h3>
                    Application Progress
                  </h3>

                  <div className="progress-timeline">

                    {/* STEP 1 */}
                    <div className="progress-step completed">

                      <div className="progress-circle">
                        ✓
                      </div>

                      <div>
                        <strong>
                          Application Created
                        </strong>

                        <p>
                          Application generated by MahaSetu
                        </p>
                      </div>

                    </div>

                    <div className="progress-line"></div>

                    {/* STEP 2 */}
                    <div className="progress-step completed">

                      <div className="progress-circle">
                        ✓
                      </div>

                      <div>
                        <strong>
                          Consent Verified
                        </strong>

                        <p>
                          Citizen authorized data sharing
                        </p>
                      </div>

                    </div>

                    <div className="progress-line"></div>

                    {/* STEP 3 */}
                    <div
                      className={
                        progress >= 3
                          ? "progress-step completed"
                          : "progress-step"
                      }
                    >

                      <div className="progress-circle">
                        {progress >= 3 ? "✓" : "3"}
                      </div>

                      <div>
                        <strong>
                          Government API Connected
                        </strong>

                        <p>
                          Data sent to Education Department
                        </p>
                      </div>

                    </div>

                    <div className="progress-line"></div>

                    {/* STEP 4 */}
                    <div
                      className={
                        progress >= 4
                          ? "progress-step completed"
                          : "progress-step current"
                      }
                    >

                      <div className="progress-circle">
                        {progress >= 4 ? "✓" : "4"}
                      </div>

                      <div>
                        <strong>
                          {status === "APPROVED"
                            ? "Application Approved"
                            : status === "REJECTED"
                            ? "Application Rejected"
                            : "Under Government Review"}
                        </strong>

                        <p>
                          {status === "APPROVED"
                            ? "Government department approved your application."
                            : status === "REJECTED"
                            ? "Government department rejected your application."
                            : "Waiting for department verification."}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Footer */}
                <div className="application-card-footer">

                  <div className="api-status">

                    <span className="api-dot"></span>

                    Government API Status:

                    <strong>
                      {" "}Connected
                    </strong>

                  </div>

                  <button
                    className="track-button"
                    onClick={() =>
                      navigate(
                        "/application-success"
                      )
                    }
                  >
                    View Details →
                  </button>

                </div>

              </div>
            );
          })}

          {/* Information */}
          <div className="application-info-box">

            <div className="info-box-icon">
              ⚡
            </div>

            <div>
              <h3>
                Real-Time Status Updates
              </h3>

              <p>
                Application information is connected
                to Firebase Firestore. When the application
                status changes in the database, this page
                automatically receives the latest data
                without requiring a page refresh.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Applications;