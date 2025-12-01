import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // 1️⃣ Check logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // 2️⃣ Fetch profile from 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  // Loading state
  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <p><strong>Name:</strong> {userData?.name || "Not set"}</p>
      <p><strong>Email:</strong> {userData?.email || "Unknown"}</p>
      {userData?.bio && (
        <p><strong>Bio:</strong> {userData.bio}</p>
      )}
      {userData?.avatar_url && (
        <img src={userData.avatar_url} alt="Profile" width="120" />
      )}
    </div>
  );
}
