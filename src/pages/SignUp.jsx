import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      // 1️⃣ Create auth account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.status === 429) {
          setErrorMsg(
            "Too many signup attempts. Please wait a few minutes and try again."
          );
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      // 2️⃣ Get user ID
      const userId = data?.user?.id || data?.session?.user?.id;

      if (userId) {
        // 3️⃣ Insert into users table
        const { error: dbError } = await supabase.from("users").upsert({
          id: userId,
          name,
          email,
          created_at: new Date(),
        });

        if (dbError) {
          setErrorMsg("Failed to save user profile: " + dbError.message);
          setLoading(false);
          return;
        }
      }

      // 4️⃣ Show confirmation popup instead of redirect
      setShowConfirmPopup(true);
    } catch (err) {
      setErrorMsg("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="login-links">
          <p>
            Already have an account? <Link to="/login" className="link-text">Login</Link>
          </p>
        </div>
      </form>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Your Email</h3>
            <p>
              A confirmation email has been sent to <strong>{email}</strong>. 
              Please check your inbox and follow the link to activate your account.
            </p>
            <button onClick={() => setShowConfirmPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
