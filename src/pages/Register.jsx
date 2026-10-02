import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

      const user = userCredential.user;

      // Save citizen profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        createdAt: new Date(),
      });

      // Save basic user information locally
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
        })
      );

      alert("Registration successful! 🎉");

      navigate("/dashboard");

    } catch (error) {
      console.error("Registration Error:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email.");
      } else {
        alert("Registration failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>🏛️ MahaSetu</h1>

        <h2>Create Account</h2>

        <p>
          Create your citizen account to access
          government services.
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;