// src/components/SearchBar.jsx
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // call parent callback
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
};

export default SearchBar;
