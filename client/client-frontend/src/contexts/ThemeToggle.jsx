// src/contexts/ThemeToggle.jsx
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Toggle Dark Mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
