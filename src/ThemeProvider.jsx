import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Load theme from Supabase
  const loadTheme = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("user_settings")
      .select("theme")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setTheme(data.theme);
    }
  };

  // Save theme to Supabase
  const saveTheme = async (newTheme) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("user_settings").upsert({
      id: user.id,
      theme: newTheme,
      updated_at: new Date()
    });
  };

  // Apply theme whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
