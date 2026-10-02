import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import "../App.css";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    education: "",
    state: "Maharashtra",
    district: "Amravati",
    income: "",
    occupation: "Student",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Get profile from Firebase in real time
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile({
            name: data.name || "",
            mobile: data.mobile || "",
            email: data.email || user.email || "",
            education: data.education || "",
            state: data.state || "Maharashtra",
            district: data.district || "Amravati",
            income: data.income || "",
            occupation: data.occupation || "Student",
          });
        } else {
          // Create basic profile if it doesn't exist
          setProfile((prev) => ({
            ...prev,
            email: user.email || "",
          }));
        }

        setLoading(false);
      },
      (error) => {
        console.error("Profile Firebase Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  // 💾 Save profile to Firebase
  const saveProfile = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...profile,
          email: profile.email || user.email || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Optional local cache
      localStorage.setItem("user", JSON.stringify(profile));
      localStorage.setItem("profileData", JSON.stringify(profile));

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);

    } catch (error) {
      console.error("Save Profile Error:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <main className="main-content">
          <h2>Loading Profile...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">🏛️ MahaSetu</h2>

        <nav>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/services">🏛️ Government Services</a>
          <a href="/ai-scheme-finder">🤖 AI Scheme Finder</a>
          <a href="/applications">📄 My Applications</a>
          <a href="/autofill">⚡ Smart Auto-Fill</a>
          <a href="/documents">📁 Documents</a>
          <a href="/consent-manager">🔐 Consent Manager</a>
          <a href="/notifications">🔔 Notifications</a>
          <a href="/profile" className="active">
            ⚙️ Profile Settings
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="top-header">
          <div>
            <h3>Profile Settings</h3>
            <p>Manage your MahaSetu citizen profile</p>
          </div>

          <div className="header-user">
            👤 {profile.name || "Citizen"}
          </div>
        </header>

        <section className="profile-page">

          {/* PROFILE INTRO */}
          <div className="profile-intro">

            <div className="profile-avatar">
              {(profile.name || "C").charAt(0).toUpperCase()}
            </div>

            <div>
              <h1>{profile.name || "Citizen"}</h1>
              <p>Citizen Profile</p>
            </div>

          </div>

          {/* SECURITY */}
          <div className="profile-security">

            <span>🛡️</span>

            <div>
              <strong>Verified Citizen Profile</strong>

              <p>
                Your profile information can be reused across connected
                government services after consent.
              </p>
            </div>

          </div>

          {/* PROFILE CARD */}
          <div className="profile-card">

            <div className="profile-card-header">

              <div>
                <h2>Personal Information</h2>

                <p>
                  Basic information used for government services.
                </p>
              </div>

              <span className="profile-badge">
                ✓ Profile Active
              </span>

            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="profile-field">
                <label>Mobile Number</label>

                <input
                  type="text"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="profile-field">
                <label>Education</label>

                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="Example: B.Tech AI & DS"
                />
              </div>

              <div className="profile-field">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <label>District</label>

                <input
                  type="text"
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <label>Annual Family Income</label>

                <input
                  type="number"
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  placeholder="Enter annual income"
                />
              </div>

              <div className="profile-field">

                <label>Occupation</label>

                <select
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                >
                  <option value="Student">Student</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employed">Employed</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Other">Other</option>
                </select>

              </div>

            </div>

            {/* SAVE */}
            <div className="profile-footer">

              {saved && (
                <span className="profile-saved">
                  ✓ Profile saved successfully
                </span>
              )}

              <button
                className="primary-btn"
                onClick={saveProfile}
              >
                💾 Save Profile
              </button>

            </div>

          </div>

          {/* SMART DATA REUSE */}
          <div className="profile-reuse">

            <div className="reuse-icon">⚡</div>

            <div>

              <h2>Smart Data Reuse</h2>

              <p>
                Your saved profile information can automatically populate
                government forms, reducing repeated data entry and errors.
              </p>

              <div className="reuse-flow">

                <span>👤 Profile</span>
                <b>→</b>
                <span>⚡ Auto-Fill</span>
                <b>→</b>
                <span>🏛️ Government Service</span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;