import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Login with Firebase Authentication
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Get citizen profile from Firestore
      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Keep basic session information locally
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

        localStorage.setItem(
          "profileData",
          JSON.stringify(userData)
        );
      }

      console.log("Login successful:", user.uid);

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        alert("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email.");
      } else {
        alert("Login failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>🏛️ MahaSetu</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to access your government services.
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;