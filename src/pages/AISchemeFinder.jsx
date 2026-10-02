import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import "../App.css";
function AISchemeFinder() {
  const navigate = useNavigate();
const { user } = useAuth();
  const [form, setForm] = useState({
  age: "",
  education: "",
  income: "",
  state: "Maharashtra",
  status: "Student",
  category: "General",
  disability: "No",
  occupation: ""
});

  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const findSchemes = async () => {
  const age = Number(form.age);
  const income = Number(form.income);

  const schemes = [
    {
      name: "Post-Matric Scholarship",
      icon: "🎓",
      department: "Education Department",
      tags: ["Student", "Income Eligible", "Maharashtra"],
      reason:
        "Recommended because your education status, income and student profile match the scheme criteria.",

      score: 0,

      conditions: [
        form.status === "Student",
        income > 0 && income <= 250000,
        form.education !== "",
        form.state === "Maharashtra"
      ]
    },

    {
      name: "Higher Education Support Scheme",
      icon: "📚",
      department: "Higher Education Department",
      tags: ["Student", "Higher Education"],
      reason:
        "Your current education and student status make you a suitable candidate for higher education support.",

      score: 0,

      conditions: [
  form.status === "Student",
  income > 0 && income <= 250000,
  form.education !== "",
  form.state === "Maharashtra",
  ["SC", "ST", "OBC", "EWS"].includes(form.category)
]
    },

    {
      name: "Youth Employment Support",
      icon: "💼",
      department: "Employment Department",
      tags: ["18+", "Job Seeker"],
      reason:
        "Your age and current job-seeking status match the preliminary eligibility criteria.",

      score: 0,

      conditions: [
        form.status === "Job Seeker",
        age >= 18,
        age <= 35,
        form.occupation !== ""
      ]
    },

    {
      name: "State Welfare Assistance",
      icon: "🏛️",
      department: "Social Welfare Department",
      tags: ["Income Eligible", "Welfare"],
      reason:
        "Your income and personal profile indicate that you may qualify for state welfare assistance.",

      score: 0,

      conditions: [
        income > 0 && income <= 300000,
        form.state === "Maharashtra"
      ]
    },

    {
      name: "Special Support Scheme",
      icon: "♿",
      department: "Social Justice Department",
      tags: ["Disability Support", "Welfare"],
      reason:
        "Your disability status indicates that you may be eligible for additional government support.",

      score: 0,

      conditions: [
        form.disability === "Yes",
        age >= 5,
        income > 0 && income <= 500000
      ]
    }
  ];

  // Calculate AI-style match score
  const results = schemes
    .map((scheme) => {

      const matchedConditions =
        scheme.conditions.filter(Boolean).length;

      const totalConditions =
        scheme.conditions.length;

      const score = Math.round(
        (matchedConditions / totalConditions) * 100
      );

      return {
        ...scheme,
        match: score
      };
    })

    // Show only reasonably relevant schemes
    .filter((scheme) => scheme.match >= 50)

    // Highest match first
    .sort((a, b) => b.match - a.match);

  setRecommendations(results);

if (user) {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        aiSchemeProfile: form,
        aiRecommendations: results,
        aiLastUpdated: serverTimestamp()
      },
      { merge: true }
    );

    console.log("AI recommendations saved to Firebase");
  } catch (error) {
    console.error("Error saving AI recommendations:", error);
  }
}
};
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

          <a
            href="/ai-scheme-finder"
            className="active-menu"
          >
            🤖 AI Scheme Finder
          </a>

          <a href="/applications">
            📋 My Applications
          </a>

          <a href="#">📁 Documents</a>

          <a href="#">🔐 Consent Manager</a>

          <a href="#">🔔 Notifications</a>

          <a href="#">👤 Profile Settings</a>
        </nav>

      </aside>


      {/* Main Content */}
      <main className="main-content">

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
            <span>👤 Khushi</span>
          </div>

        </header>


        <section className="ai-page">

          {/* Heading */}
          <div className="ai-heading">

            <span className="page-label">
              AI POWERED
            </span>

            <h1>
              🤖 AI Scheme Finder
            </h1>

            <p>
              Tell us about yourself and MahaSetu will
              find government schemes you may be eligible for.
            </p>

          </div>


          {/* Profile Form */}
          <div className="ai-form-card">

            <h2>
              Tell us about yourself
            </h2>

            <p className="form-subtitle">
              This information is used only to find suitable
              government schemes.
            </p>


            <div className="ai-form-grid">

              <div className="form-group">
                <label>Age</label>

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
              </div>


              <div className="form-group">
                <label>Education</label>

                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                >
                  <option value="">
                    Select education
                  </option>

                  <option value="10th">
                    10th
                  </option>

                  <option value="12th">
                    12th
                  </option>

                  <option value="Diploma">
                    Diploma
                  </option>

                  <option value="B.Tech">
                    B.Tech
                  </option>

                  <option value="B.Sc">
                    B.Sc
                  </option>

                  <option value="B.Com">
                    B.Com
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label>Annual Family Income</label>

                <input
                  type="number"
                  name="income"
                  value={form.income}
                  onChange={handleChange}
                  placeholder="₹ Enter annual income"
                />
              </div>


              <div className="form-group">
                <label>State</label>

                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Gujarat">
                    Gujarat
                  </option>

                  <option value="Madhya Pradesh">
                    Madhya Pradesh
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label>Current Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Student">
                    Student
                  </option>

                  <option value="Job Seeker">
                    Job Seeker
                  </option>

                  <option value="Employed">
                    Employed
                  </option>
                </select>
              </div>

            </div>
            <div className="form-group">
  <label>Category</label>

  <select
    name="category"
    value={form.category}
    onChange={handleChange}
  >
    <option value="General">General</option>
    <option value="OBC">OBC</option>
    <option value="SC">SC</option>
    <option value="ST">ST</option>
    <option value="EWS">EWS</option>
  </select>
</div>


<div className="form-group">
  <label>Disability Status</label>

  <select
    name="disability"
    value={form.disability}
    onChange={handleChange}
  >
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</div>


<div className="form-group">
  <label>Occupation</label>

  <input
    type="text"
    name="occupation"
    value={form.occupation}
    onChange={handleChange}
    placeholder="Enter your occupation"
  />
</div>


            <button
              className="find-schemes-button"
              onClick={findSchemes}
            >
              🤖 Find Eligible Schemes
            </button>

          </div>


          {/* Results */}
          {recommendations.length > 0 && (

            <div className="recommendations-section">

              <div className="recommendations-title">

                <div>
                  <span className="page-label">
                    RECOMMENDATIONS
                  </span>

                  <h2>
                    Schemes You May Be Eligible For
                  </h2>
                </div>

                <span className="recommendation-count">
                  {recommendations.length} Found
                </span>

              </div>


              <div className="recommendations-grid">

                {recommendations.map((scheme, index) => (

                  <div
                    className="scheme-card"
                    key={index}
                  >

                    <div className="scheme-card-top">

                      <div className="scheme-icon">
                        {scheme.icon}
                      </div>

                      <div className="match-score">
                        {scheme.match}% Match
                      </div>

                    </div>


                    <h3>
                      {scheme.name}
                    </h3>

                    <p className="scheme-department">
                      🏛️ {scheme.department}
                    </p>

                    <p className="scheme-reason">
                      {scheme.reason}
                    </p>


                    <div className="scheme-tags">

                      {scheme.tags.map((tag, i) => (
                        <span key={i}>
                          ✓ {tag}
                        </span>
                      ))}

                    </div>


                    <button
  className="scheme-apply-button"
  onClick={() =>
    navigate("/service-details", {
      state: {
        scheme: scheme
      }
    })
  }
>
  View & Apply →
</button>
                  </div>

                ))}

              </div>

            </div>

          )}


          {/* Initial information */}
          {recommendations.length === 0 && (

            <div className="ai-info-box">

              <div className="ai-info-icon">
                💡
              </div>

              <div>
                <h3>
                  How MahaSetu AI works
                </h3>

                <p>
                  MahaSetu analyzes your profile against
                  government scheme eligibility rules and
                  ranks the most relevant schemes for you.
                </p>
              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AISchemeFinder;