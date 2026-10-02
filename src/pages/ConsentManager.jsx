import React, { useState } from "react";
import "../App.css";

function ConsentManager() {
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem("consentGiven") === "true"
  );

  const [sharing, setSharing] = useState({
    name: true,
    mobile: true,
    email: true,
    education: true,
    income: false,
    documents: false,
  });

  const toggleSharing = (field) => {
    setSharing({
      ...sharing,
      [field]: !sharing[field],
    });
  };

  const revokeConsent = () => {
    localStorage.setItem("consentGiven", "false");
    setConsentGiven(false);
    alert("Consent has been revoked.");
  };

  const giveConsent = () => {
    localStorage.setItem("consentGiven", "true");
    setConsentGiven(true);
    alert("Consent has been granted.");
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">🏛️ MahaSetu</h2>

        <nav>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/services">🏛️ Government Services</a>
          <a href="/ai-scheme-finder">🤖 AI Scheme Finder</a>
          <a href="/applications">📄 My Applications</a>
          <a href="/autofill">⚡ Smart Auto-Fill</a>
          <a href="/documents">📁 Documents</a>

          <a href="/consent-manager" className="active">
            🔐 Consent Manager
          </a>

          <a href="#">🔔 Notifications</a>
          <a href="#">⚙️ Profile Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="top-header">
          <div>
            <h3>Consent Manager</h3>
            <p>Control how your information is shared</p>
          </div>

          <div className="header-user">
            👤 Khushi
          </div>
        </header>

        <section className="consent-manager-page">

          {/* Intro */}
          <div className="consent-manager-intro">

            <div className="consent-manager-icon">
              🔐
            </div>

            <div>
              <h1>Consent Manager</h1>
              <p>
                You control what information MahaSetu can share
                with government departments.
              </p>
            </div>

          </div>

          {/* Security Banner */}
          <div className="consent-security">

            <span>🛡️</span>

            <div>
              <strong>Your data, your control</strong>

              <p>
                Government services can access only the information
                you authorize.
              </p>
            </div>

          </div>

          {/* Active Consent */}
          <div className="consent-card">

            <div className="consent-card-header">

              <div>
                <h2>Government Scholarship</h2>

                <p>
                  Education Department
                </p>
              </div>

              <span
                className={
                  consentGiven
                    ? "consent-status active"
                    : "consent-status revoked"
                }
              >
                {consentGiven
                  ? "✓ Consent Active"
                  : "✕ Consent Revoked"}
              </span>

            </div>

            <div className="consent-divider"></div>

            <h3>Information Shared</h3>

            <div className="consent-data-list">

              <ConsentRow
                label="Full Name"
                value={sharing.name}
                onToggle={() => toggleSharing("name")}
              />

              <ConsentRow
                label="Mobile Number"
                value={sharing.mobile}
                onToggle={() => toggleSharing("mobile")}
              />

              <ConsentRow
                label="Email Address"
                value={sharing.email}
                onToggle={() => toggleSharing("email")}
              />

              <ConsentRow
                label="Education Details"
                value={sharing.education}
                onToggle={() => toggleSharing("education")}
              />

              <ConsentRow
                label="Annual Income"
                value={sharing.income}
                onToggle={() => toggleSharing("income")}
              />

              <ConsentRow
                label="Documents"
                value={sharing.documents}
                onToggle={() => toggleSharing("documents")}
              />

            </div>

            <div className="consent-actions">

              {!consentGiven ? (
                <button
                  className="primary-btn"
                  onClick={giveConsent}
                >
                  ✓ Give Consent
                </button>
              ) : (
                <button
                  className="revoke-btn"
                  onClick={revokeConsent}
                >
                  Revoke Consent
                </button>
              )}

            </div>

          </div>

          {/* Consent History */}
          <div className="consent-history">

            <h2>Consent History</h2>

            <div className="history-item">

              <div className="history-icon">
                🎓
              </div>

              <div className="history-content">

                <strong>
                  Government Scholarship
                </strong>

                <p>
                  Education Department requested access to
                  basic profile information.
                </p>

                <small>
                  06 September 2026 • Consent Granted
                </small>

              </div>

              <span className="history-status">
                Approved
              </span>

            </div>

            <div className="history-item">

              <div className="history-icon">
                🏛️
              </div>

              <div className="history-content">

                <strong>
                  Education Certificate
                </strong>

                <p>
                  Education Department accessed education
                  information.
                </p>

                <small>
                  05 September 2026 • Consent Granted
                </small>

              </div>

              <span className="history-status">
                Approved
              </span>

            </div>

          </div>

          {/* Explanation */}
          <div className="consent-explanation">

            <div className="explanation-icon">
              💡
            </div>

            <div>

              <h2>Why Consent Matters</h2>

              <p>
                MahaSetu follows a consent-first approach.
                Instead of giving government departments unrestricted
                access to your information, you decide exactly what
                data can be shared for each service.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* Reusable Consent Row */

function ConsentRow({ label, value, onToggle }) {
  return (
    <div className="consent-row">

      <div>
        <strong>{label}</strong>

        <p>
          {value
            ? "This information will be shared"
            : "This information will not be shared"}
        </p>
      </div>

      <button
        className={`consent-toggle ${
          value ? "toggle-on" : "toggle-off"
        }`}
        onClick={onToggle}
      >
        <span></span>
      </button>

    </div>
  );
}

export default ConsentManager;