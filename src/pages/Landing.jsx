import { Link } from "react-router-dom";
import "../App.css";

function Landing() {
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">🌐</div>

          <div>
            <h2>MahaSetu</h2>
            <span>AI-Powered Government Services</span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#services">Services</a>

          <a href="#about">About</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="signup-btn">
            Get Started
          </Link>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="hero" id="home">

        {/* Left Side */}
        <div className="hero-content">

          <div className="badge">
            ✨ One Platform. Many Government Services.
          </div>

          <h1>
            Government Services,
            <span> Connected.</span>
          </h1>

          <p>
            Access government schemes, scholarships, certificates
            and services from one intelligent platform.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <a href="#services" className="secondary-btn">
              Explore Services
            </a>

          </div>

          <div className="trust">
            ✓ Secure &nbsp;&nbsp;
            ✓ Consent Based &nbsp;&nbsp;
            ✓ AI Powered
          </div>

        </div>


        {/* Right Side Preview Card */}
        <div className="hero-card">

          {/* Card Header */}
          <div className="card-header">

            <div>
              <span>Welcome to</span>
              <h3>MahaSetu</h3>
            </div>

            <div className="profile-circle">
              👤
            </div>

          </div>


          {/* Search */}
          <div className="search-box">
            🔍 Search government services...
          </div>


          {/* Quick Services */}
          <div className="quick-services">

            <div className="service">
              <span>🎓</span>
              <span>Scholarships</span>
            </div>

            <div className="service">
              <span>📄</span>
              <span>Certificates</span>
            </div>

            <div className="service">
              <span>🏛️</span>
              <span>Government Schemes</span>
            </div>

            <div className="service">
              <span>📋</span>
              <span>Applications</span>
            </div>

          </div>


          {/* AI Scheme Finder */}
          <div className="ai-box">

            <div className="ai-icon">
              ✨
            </div>

            <div>
              <strong>AI Scheme Finder</strong>

              <p>
                Find schemes you may be eligible for
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features" id="services">

        <div className="section-title">

          <span>WHY MAHASETU?</span>

          <h2>
            Everything you need in one place
          </h2>

          <p>
            Simplifying access to government services through
            technology and interoperability.
          </p>

        </div>


        {/* Feature Cards */}
        <div className="feature-grid">

          {/* AI */}
          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              AI Scheme Finder
            </h3>

            <p>
              Discover government schemes and scholarships
              based on your profile.
            </p>

          </div>


          {/* Integration */}
          <div className="feature-card">

            <div className="feature-icon">
              🔗
            </div>

            <h3>
              Connected Services
            </h3>

            <p>
              Connect multiple government platforms through
              a single integration layer.
            </p>

          </div>


          {/* Consent */}
          <div className="feature-card">

            <div className="feature-icon">
              🔐
            </div>

            <h3>
              Consent Based
            </h3>

            <p>
              You control which information is shared and
              with which government service.
            </p>

          </div>


          {/* Tracking */}
          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Application Tracking
            </h3>

            <p>
              Track all your government applications from
              one dashboard.
            </p>

          </div>

        </div>

      </section>


      {/* ================= ABOUT SECTION ================= */}
      <section className="about-section" id="about">

        <div className="about-content">

          <span>ABOUT MAHASETU</span>

          <h2>
            One digital bridge between citizens
            and government services.
          </h2>

          <p>
            MahaSetu provides a unified interface for accessing
            government services while an interoperability layer
            enables secure communication between different
            government platforms.
          </p>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer>

        <div>

          <h3>
            🌐 MahaSetu
          </h3>

          <p>
            AI-Powered Government Service
            Interoperability Platform
          </p>

        </div>

        <p>
          © 2026 MahaSetu. SIH Prototype.
        </p>

      </footer>

    </div>
  );
}

export default Landing;