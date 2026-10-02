import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Citizen");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 🔥 REAL-TIME FIRESTORE CONNECTION
  // =====================================================

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    // ---------------------------------------------
    // 👤 REAL-TIME USER PROFILE
    // ---------------------------------------------

    const userRef = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();

          setUserName(userData.name || "Citizen");
        }
      },
      (error) => {
        console.error("User Firebase Error:", error);
      }
    );

    // ---------------------------------------------
    // 📄 REAL-TIME APPLICATIONS
    // ---------------------------------------------

    const applicationsRef = collection(db, "applications");

    const applicationsQuery = query(
      applicationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribeApplications = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        const applicationList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setApplications(applicationList);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Dashboard Application Firebase Error:",
          error
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeApplications();
    };
  }, [navigate]);

  // =====================================================
  // 📊 APPLICATION COUNTS
  // =====================================================

  const totalApplications = applications.length;

  const approvedApplications = applications.filter(
    (app) =>
      String(app.status || "").toUpperCase() === "APPROVED"
  ).length;

  const pendingApplications = applications.filter(
    (app) => {
      const status = String(
        app.status || ""
      ).toUpperCase();

      return (
        status === "SUBMITTED" ||
        status === "UNDER_REVIEW" ||
        status === "PENDING"
      );
    }
  ).length;

  // =====================================================
  // 📈 PROGRESS CALCULATOR
  // =====================================================

  const getProgress = (status) => {
    const currentStatus = String(
      status || "SUBMITTED"
    ).toUpperCase();

    switch (currentStatus) {
      case "APPROVED":
        return 100;

      case "REJECTED":
        return 100;

      case "UNDER_REVIEW":
        return 60;

      case "PENDING":
        return 40;

      case "SUBMITTED":
      default:
        return 20;
    }
  };

  // =====================================================
  // ⏳ LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>📊 Loading Dashboard...</h2>
          <p>
            Connecting to your MahaSetu account.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // 🖥️ DASHBOARD
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            🌐
          </div>

          <div>
            <h2>MahaSetu</h2>
            <span>Government Services</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="active"
          >
            🏠
            <span>Dashboard</span>
          </Link>

          <Link to="/services">
            🏛️
            <span>Government Services</span>
          </Link>

          <Link to="/ai-scheme-finder">
            🤖
            <span>AI Scheme Finder</span>
          </Link>

          <Link to="/applications">
            📄
            <span>My Applications</span>
          </Link>

          <Link to="/documents">
            📁
            <span>Documents</span>
          </Link>

          <Link to="/consent-manager">
            🔐
            <span>Consent Manager</span>
          </Link>

          <Link to="/notifications">
            🔔
            <span>Notifications</span>
          </Link>

          <Link to="/profile">
            ⚙️
            <span>Profile Settings</span>
          </Link>

        </nav>

        {/* Help Box */}

        <div className="help-box">

          <h3>👋 Need Help?</h3>

          <p>
            Ask MahaSetu Assistant for any help.
          </p>

          <button>
            Chat with Assistant
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-header">

          <div className="dashboard-search">

            🔍

            <input
              type="text"
              placeholder="Search services, schemes, departments..."
            />

          </div>

          <div className="header-right">

            <button
              className="notification-btn"
              onClick={() =>
                navigate("/notifications")
              }
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <span className="language">
              🌐
            </span>

            <div className="user-profile">

              <div className="user-avatar">
                👤
              </div>

              <div>
                <strong>{userName}</strong>
                <span>Citizen</span>
              </div>

              <span>⌄</span>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <section className="dashboard-content">

          {/* Welcome */}

          <div className="welcome-section">

            <div>

              <h1>
                Welcome back, {userName}! 👋
              </h1>

              <p>
                Access government services, schemes and
                track your applications in one place.
              </p>

            </div>

            <div className="today">
              Today
            </div>

          </div>

          {/* ================= STAT CARDS ================= */}

          <div className="stats">

            {/* TOTAL APPLICATIONS */}

            <div className="stat-card">

              <div className="stat-icon blue">
                📄
              </div>

              <div>

                <span>
                  Total Applications
                </span>

                <strong>
                  {totalApplications}
                </strong>

                <small
                  onClick={() =>
                    navigate("/applications")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all applications →
                </small>

              </div>

            </div>

            {/* APPROVED */}

            <div className="stat-card">

              <div className="stat-icon green">
                ✓
              </div>

              <div>

                <span>
                  Approved
                </span>

                <strong>
                  {approvedApplications}
                </strong>

                <small
                  onClick={() =>
                    navigate("/applications")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all →
                </small>

              </div>

            </div>

            {/* PENDING */}

            <div className="stat-card">

              <div className="stat-icon orange">
                ⏳
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {pendingApplications}
                </strong>

                <small
                  onClick={() =>
                    navigate("/applications")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all →
                </small>

              </div>

            </div>

            {/* TOTAL SERVICES */}

            <div className="stat-card">

              <div className="stat-icon purple">
                🏛️
              </div>

              <div>

                <span>
                  Total Services
                </span>

                <strong>
                  24
                </strong>

                <small
                  onClick={() =>
                    navigate("/services")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Explore services →
                </small>

              </div>

            </div>

          </div>

          {/* ================= TWO COLUMN SECTION ================= */}

          <div className="dashboard-grid">

            {/* AI RECOMMENDATIONS */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  ✨ AI Scheme Recommendations
                </h2>

                <span
                  onClick={() =>
                    navigate("/ai-scheme-finder")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all
                </span>

              </div>

              <div className="recommendation">

                <div className="recommendation-icon green">
                  🎓
                </div>

                <div className="recommendation-info">

                  <strong>
                    Post Matric Scholarship Scheme
                  </strong>

                  <span>
                    Education Department
                  </span>

                </div>

                <b>95% Match</b>

                <button
                  onClick={() =>
                    navigate("/ai-scheme-finder")
                  }
                >
                  View Details
                </button>

              </div>

              <div className="recommendation">

                <div className="recommendation-icon purple">
                  👥
                </div>

                <div className="recommendation-info">

                  <strong>
                    Merit Cum Means Scholarship
                  </strong>

                  <span>
                    Social Justice Department
                  </span>

                </div>

                <b>89% Match</b>

                <button
                  onClick={() =>
                    navigate("/ai-scheme-finder")
                  }
                >
                  View Details
                </button>

              </div>

              <div className="recommendation">

                <div className="recommendation-icon orange">
                  🏆
                </div>

                <div className="recommendation-info">

                  <strong>
                    Education Fee Reimbursement
                  </strong>

                  <span>
                    Tribal Development Department
                  </span>

                </div>

                <b>82% Match</b>

                <button
                  onClick={() =>
                    navigate("/ai-scheme-finder")
                  }
                >
                  View Details
                </button>

              </div>

              <div className="profile-reminder">

                ✨ Update your profile to get better
                recommendations

                <button
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  Update Profile
                </button>

              </div>

            </div>

            {/* APPLICATION STATUS */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  Application Status
                </h2>

                <span
                  onClick={() =>
                    navigate("/applications")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all
                </span>

              </div>

              {/* REAL FIREBASE APPLICATIONS */}

              {applications.length === 0 ? (

                <div className="application-info-box">

                  <div className="info-box-icon">
                    📭
                  </div>

                  <div>
                    <h3>
                      No Applications Yet
                    </h3>

                    <p>
                      Your applications will appear
                      here after submission.
                    </p>
                  </div>

                </div>

              ) : (

                applications
                  .slice(0, 4)
                  .map((application) => {

                    const status =
                      String(
                        application.status ||
                        "SUBMITTED"
                      ).toUpperCase();

                    const progress =
                      getProgress(status);

                    return (

                      <div
                        className="application"
                        key={application.id}
                      >

                        <div className="application-icon">
                          🎓
                        </div>

                        <div className="application-info">

                          <strong>
                            {application.service ||
                              "Government Scholarship"}
                          </strong>

                          <span>
                            APP-ID:{" "}
                            {application.governmentApplicationId ||
                              application.id}
                          </span>

                        </div>

                        <div className="application-progress">

                          <strong
                            className={
                              status === "APPROVED"
                                ? "approved"
                                : ""
                            }
                          >
                            {status === "UNDER_REVIEW"
                              ? "Under Review"
                              : status}
                          </strong>

                          <div className="progress-bar">

                            <div
                              className={
                                status === "APPROVED"
                                  ? "progress green"
                                  : status === "UNDER_REVIEW"
                                  ? "progress yellow"
                                  : "progress blue"
                              }
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            ></div>

                          </div>

                          <span>
                            {progress}%
                          </span>

                        </div>

                      </div>

                    );
                  })

              )}

            </div>

          </div>

          {/* ================= BOTTOM SECTION ================= */}

          <div className="bottom-grid">

            {/* POPULAR SERVICES */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  Popular Services
                </h2>

                <span
                  onClick={() =>
                    navigate("/services")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all services
                </span>

              </div>

              <div className="popular-services">

                <div>
                  🎓
                  <span>Scholarships</span>
                </div>

                <div>
                  📝
                  <span>CET</span>
                </div>

                <div>
                  📄
                  <span>Certificates</span>
                </div>

                <div>
                  👥
                  <span>Welfare Schemes</span>
                </div>

                <div>
                  📚
                  <span>Education</span>
                </div>

                <div>
                  ▦
                  <span>More Services</span>
                </div>

              </div>

            </div>

            {/* NOTIFICATIONS */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  Recent Notifications
                </h2>

                <span
                  onClick={() =>
                    navigate("/notifications")
                  }
                  style={{ cursor: "pointer" }}
                >
                  View all
                </span>

              </div>

              <div className="notification-item">

                <div className="notification-icon green">
                  ✓
                </div>

                <p>
                  Your application information is
                  connected to MahaSetu.
                </p>

                <span>
                  Live
                </span>

              </div>

              <div className="notification-item">

                <div className="notification-icon blue">
                  ℹ
                </div>

                <p>
                  Application status updates are
                  synchronized in real time.
                </p>

                <span>
                  Live
                </span>

              </div>

              <div className="notification-item">

                <div className="notification-icon purple">
                  🔔
                </div>

                <p>
                  Check AI Scheme Finder for new
                  recommendations.
                </p>

                <span>
                  Now
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;