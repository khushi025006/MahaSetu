import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

function ServiceDetails() {
  const location = useLocation();
  const scheme = location.state?.scheme;

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">MahaSetu</h2>

        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/services" className="active">🏛️ Government Services</Link>
          <Link to="/ai-scheme-finder">🤖 AI Scheme Finder</Link>
          <Link to="/applications">📋 My Applications</Link>
          <Link to="/documents">📄 Documents</Link>
          <Link
  to="/autofill"
  state={{
    scheme: scheme
  }}
  className="apply-button"
>
  Apply Now →
</Link>
          <Link to="/notifications">🔔 Notifications</Link>
          <Link to="/profile">👤 Profile Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">
          <input
            type="text"
            placeholder="Search services..."
            className="top-search"
          />

          <div className="topbar-right">
            <span>🌐 English</span>
            <span>🔔</span>
            <span>👤 Citizen</span>
          </div>
        </header>

        {/* Back Button */}
        <Link to="/services" className="back-link">
          ← Back to Government Services
        </Link>

        {/* Service Details */}
        <section className="service-details">

          <div className="service-details-icon">
  {scheme?.icon || "🎓"}
</div>
          <span className="connected-badge">
            ✓ Connected Government Service
          </span>

          <h1>
  {scheme?.name || "Government Scholarship"}
</h1>
{scheme?.match && (
  <div className="ai-match-badge">
    🤖 AI Eligibility Match: {scheme.match}%
  </div>
)}

          <p className="service-description">
            Apply for eligible government scholarship schemes through
            MahaSetu using a single integrated application process.
          </p>

          {/* Information */}
          <div className="details-grid">

            <div className="detail-box">
              <h3>📌 Service Provider</h3>
             <p>
  {scheme?.department || "Government Education Department"}
</p>
            </div>

            <div className="detail-box">
              <h3>👥 Eligibility</h3>
             <p>
  {scheme?.reason ||
    "Students meeting the required eligibility criteria"}
</p>
            </div>

            <div className="detail-box">
              <h3>📄 Required Documents</h3>
              <p>Education documents, income proof and identity details</p>
            </div>

            <div className="detail-box">
              <h3>⏱️ Processing Time</h3>
              <p>7–15 working days</p>
            </div>

          </div>

          {/* Interoperability */}
          <div className="integration-box">

            <h2>🔗 MahaSetu Integration</h2>

            <p>
              MahaSetu securely connects with the concerned government
              service through an authorized API integration layer.
            </p>

            <div className="integration-flow">
              <span>👤 Citizen</span>
              <strong>→</strong>
              <span>🔄 MahaSetu</span>
              <strong>→</strong>
              <span>🏛️ Government API</span>
            </div>

          </div>

          {/* Apply */}
          <div className="apply-section">

            <h2>Ready to Apply?</h2>

            <p>
              Your information will be shared with the government service
              only after you provide consent.
            </p>

            <Link to="/consent" className="apply-button">
              Apply Now →
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

export default ServiceDetails;