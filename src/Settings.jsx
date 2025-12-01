import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useTheme } from "./ThemeProvider";

export default function Settings() {
  const [userData, setUserData] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserData(data);
    };
    fetchUser();
  }, []);

  if (!userData) return <p>Loading settings...</p>;

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>

      <div>
        <strong>Theme:</strong>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </div>
      {/* Add more settings fields here */}
    </div>
  );
}
