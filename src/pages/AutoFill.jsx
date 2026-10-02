import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../App.css";

function AutoFill() {
  const navigate = useNavigate();
const location = useLocation();

const scheme = location.state?.scheme;
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    education: "",
    address: "",
    income: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Real-time profile listener
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const profile = snapshot.data();

          setFormData({
            name: profile.name || "",
            mobile: profile.mobile || "",
            email: profile.email || "",
            education: profile.education || "",
            address:
              profile.district && profile.state
                ? `${profile.district}, ${profile.state}`
                : "",
            income: profile.income || "",
          });
        }

        setLoading(false);
      },
      (error) => {
        console.error("Auto-Fill Firebase Error:", error);
        setLoading(false);
      }
    );

    // Stop listener when page is closed
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
  localStorage.setItem(
    "autoFillData",
    JSON.stringify(formData)
  );

  localStorage.setItem(
    "selectedScheme",
    JSON.stringify(scheme || {})
  );

  navigate("/consent", {
    state: {
      scheme: scheme
    }
  });
};

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>⚡ Loading Smart Auto-Fill...</h2>
          <p>Fetching your profile from MahaSetu.</p>
        </div>
      </div>
    );
  }

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
          <a href="/autofill" className="active">
            ⚡ Smart Auto-Fill
          </a>
          <a href="/documents">📁 Documents</a>
          <a href="/consent-manager">🔐 Consent Manager</a>
          <a href="/notifications">🔔 Notifications</a>
          <a href="/profile">⚙️ Profile Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="top-header">
          <div>
            <h3>Smart Auto-Fill</h3>
            <p>
              Save time by reusing your verified profile information
            </p>
          </div>

          <div className="header-user">
            👤 {formData.name || "Citizen"}
          </div>
        </header>

        {/* Page */}
        <section className="autofill-page">

          <div className="autofill-intro">
            <div className="autofill-icon">⚡</div>

            <div>
              <h1>Smart Auto-Fill</h1>
              <p>
                Your saved information is automatically filled into
                government service forms.
              </p>
            </div>
          </div>

          {/* Information Box */}
          <div className="autofill-info">
            🔒 <strong>Privacy Protected:</strong>
            Your information is used only after you give consent.
          </div>

          {/* Real-time status */}
          <div className="autofill-info">
            🟢 <strong>Live Profile Connected:</strong>
            Changes made to your profile are synchronized automatically.
          </div>

          {/* Form Card */}
          <div className="autofill-card">

            <div className="card-heading">
              <div>
                <h2>
  {scheme?.name || "Government Scholarship"} Application
</h2>
                <p>
                  Review your information before continuing.
                </p>
                {scheme && (
  <div className="selected-scheme-info">
    <span>{scheme.icon}</span>

    <div>
      <strong>{scheme.name}</strong>
      <small>
        🤖 AI Match: {scheme.match}%
      </small>
    </div>
  </div>
)}
              </div>

              <span className="autofill-badge">
                ✓ Auto-Filled
              </span>
            </div>

            <div className="autofill-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Annual Income</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="autofill-footer">

              <button
                className="secondary-btn"
                onClick={() => navigate("/services")}
              >
                ← Back
              </button>

              <button
                className="primary-btn"
                onClick={handleContinue}
              >
                Continue to Consent →
              </button>

            </div>

          </div>

          {/* How It Works */}
          <div className="autofill-how">

            <h2>How Smart Auto-Fill Works</h2>

            <div className="how-grid">

              <div className="how-item">
                <span>1</span>
                <h3>Your Profile</h3>
                <p>
                  Your verified information is stored securely.
                </p>
              </div>

              <div className="how-item">
                <span>2</span>
                <h3>Select Service</h3>
                <p>
                  MahaSetu identifies the information required.
                </p>
              </div>

              <div className="how-item">
                <span>3</span>
                <h3>Auto-Fill</h3>
                <p>
                  Required information is automatically populated.
                </p>
              </div>

              <div className="how-item">
                <span>4</span>
                <h3>Consent</h3>
                <p>
                  You approve what information can be shared.
                </p>
              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default AutoFill;