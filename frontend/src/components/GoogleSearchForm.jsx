import React, { useState } from "react";

const GoogleSearchForm = ({ onSearch, loading, onClear }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { value: "", label: "Select a Category" },
    { value: "Product", label: "Product" },
    { value: "Service", label: "Service" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query, category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      {" "}
      <div className="form-grid">
        {" "}
        {/* Swapped order of these two div elements */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Search Query</label>{" "}
          <input
            type="text"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="button-group">
        <button type="submit" className="button-submit" disabled={loading}>
          {loading ? "Searching.." : "Search"}
        </button>
        <button type="button" className="clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default GoogleSearchForm;