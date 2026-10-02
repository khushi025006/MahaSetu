import { Link } from "react-router-dom";
import "../App.css";

function Services() {

  const services = [
    {
      icon: "🎓",
      title: "Scholarships",
      description: "Find and apply for education scholarships.",
      department: "Education Department",
      category: "Education"
    },
    {
      icon: "📚",
      title: "Education Services",
      description: "Access admission, education and student services.",
      department: "Education Department",
      category: "Education"
    },
    {
      icon: "📄",
      title: "Certificates",
      description: "Apply for important government certificates.",
      department: "Revenue Department",
      category: "Certificates"
    },
    {
      icon: "🏠",
      title: "Welfare Schemes",
      description: "Discover welfare schemes you may be eligible for.",
      department: "Social Welfare Department",
      category: "Welfare"
    },
    {
      icon: "💼",
      title: "Employment",
      description: "Explore government employment opportunities.",
      department: "Employment Department",
      category: "Employment"
    },
    {
      icon: "📝",
      title: "CET & Entrance",
      description: "Access entrance examination related services.",
      department: "Higher Education Department",
      category: "Education"
    },
    {
      icon: "🏥",
      title: "Health Services",
      description: "Access government healthcare related services.",
      department: "Health Department",
      category: "Health"
    },
    {
      icon: "🌾",
      title: "Agriculture Schemes",
      description: "Find schemes and services for farmers.",
      department: "Agriculture Department",
      category: "Agriculture"
    }
  ];

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

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

          <Link to="/dashboard">
            🏠
            <span>Dashboard</span>
          </Link>

          <Link to="/services" className="active">
            🏛️
            <span>Government Services</span>
          </Link>

          <Link to="/scheme-finder">
            ✨
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

          <Link to="/consent">
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

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="dashboard-search">
            🔍

            <input
              type="text"
              placeholder="Search government services..."
            />

          </div>

          <div className="header-right">

            <button className="notification-btn">
              🔔
            </button>

            <span className="language">
              🌐
            </span>

            <div className="user-profile">

              <div className="user-avatar">
                👤
              </div>

              <div>
                <strong>Citizen</strong>
                <span>Citizen</span>
              </div>

            </div>

          </div>

        </header>


        {/* SERVICES */}

        <section className="services-content">

          <div className="services-heading">

            <div>

              <span className="page-label">
                GOVERNMENT SERVICES
              </span>

              <h1>
                Explore Government Services
              </h1>

              <p>
                Access multiple government services from one
                unified platform.
              </p>

            </div>

            <Link
              to="/scheme-finder"
              className="ai-service-button"
            >
              ✨ Find Schemes with AI
            </Link>

          </div>


          {/* SEARCH */}

          <div className="service-search">

            🔍

            <input
              type="text"
              placeholder="Search for a service..."
            />

          </div>


          {/* CATEGORIES */}

          <div className="category-buttons">

            <button className="category-active">
              All Services
            </button>

            <button>
              Education
            </button>

            <button>
              Certificates
            </button>

            <button>
              Welfare
            </button>

            <button>
              Employment
            </button>

            <button>
              Health
            </button>

            <button>
              Agriculture
            </button>

          </div>


          {/* SERVICE GRID */}

          <div className="services-grid">

            {services.map((service, index) => (

              <div
                className="service-card"
                key={index}
              >

                <div className="service-card-top">

                  <div className="service-big-icon">
                    {service.icon}
                  </div>

                  <span className="service-status">
                    ● Available
                  </span>

                </div>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.description}
                </p>

                <div className="service-department">

                  🏛️

                  <span>
                    {service.department}
                  </span>

                </div>

                <div className="service-card-footer">

                  <span>
                    🔗 Connected Service
                  </span>

                  <Link
                    to="/service-details"
                    className="view-service"
                  >
                    View →
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Services;