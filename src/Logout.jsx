import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logOut = async () => {
      await supabase.auth.signOut();
      navigate("/"); // Redirect to home
    };
    logOut();
  }, [navigate]);

  return <p>Logging out...</p>;
}
