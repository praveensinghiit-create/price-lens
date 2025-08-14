import React, { useState } from "react";
import './SearchSource.css';

// ToggleSwitch Component (now using classNames)
const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="ss-toggle-switch">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={`Enable ${label}`}
    />
    <span className="ss-toggle-track"></span>
    <span className="ss-toggle-thumb" style={{ left: checked ? 24 : 4 }}></span>
  </label>
);

// SourceForm Component
const SourceForm = ({ newSource, onChange, onSubmit }) => (
  <form className="ss-form" onSubmit={onSubmit}>
    <div className="ss-form-group">
      <label>
        Source Name
        <input
          type="text"
          name="name"
          value={newSource.name}
          onChange={onChange}
          placeholder="e.g. Google"
          required
        />
      </label>
    </div>
    <div className="ss-form-group">
      <label>
        Source URL
        <input
          type="url"
          name="url"
          value={newSource.url}
          onChange={onChange}
          placeholder="https://..."
          required
        />
      </label>
    </div>
    <button type="submit" className="ss-add-btn">Add Source</button>
  </form>
);

// SourceTable Component
const SourceTable = ({ sources, onToggle, onDelete }) => (
  <div className="ss-table-container">
    <table className="ss-table">
      <thead>
        <tr>
          <th>Source</th>
          <th>URL</th>
          <th className="ss-table-center">Enable</th>
          <th className="ss-table-center">Delete</th>
        </tr>
      </thead>
      <tbody>
        {sources.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#888" }}>
              No sources configured.
            </td>
          </tr>
        ) : (
          sources.map((src, idx) => (
            <tr key={`${src.name}-${src.url}`}>
              <td>{src.name}</td>
              <td>
                <a href={src.url} target="_blank" rel="noopener noreferrer">
                  {src.url}
                </a>
              </td>
              <td className="ss-table-center">
                <ToggleSwitch checked={src.enabled} onChange={() => onToggle(idx)} label={src.name} />
              </td>
              <td className="ss-table-center">
                <button
                  onClick={() => onDelete(idx)}
                  aria-label={`Delete ${src.name}`}
                  className="ss-delete-btn"
                  title="Delete"
                >
                  &#10006;
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ActionButtons Component
const ActionButtons = () => (
  <div className="ss-btn-row">
    <button className="ss-btn ss-save">Save</button>
    <button className="ss-btn ss-cancel">Cancel</button>
  </div>
);

// Preloaded sources
const PRELOADED_SOURCES = [
  { name: "Takealot", url: "https://www.takealot.co.za", enabled: true },
  { name: "Amazon South Africa", url: "https://www.amazon.co.za", enabled: true },
  { name: "Makro", url: "https://www.makro.co.za", enabled: true },
  { name: "Waltons", url: "https://www.waltons.co.za", enabled: true },
  { name: "HiFi Corp", url: "https://www.hificorp.co.za", enabled: true },
  { name: "Incredible Connection", url: "https://www.incredible.co.za", enabled: true },
  { name: "Game", url: "https://www.game.co.za", enabled: true },
  { name: "Checkers", url: "https://www.checkers.co.za", enabled: true },
  { name: "Pick n Pay", url: "https://www.pnp.co.za", enabled: true },
  { name: "Woolworths", url: "https://www.woolworths.co.za", enabled: true },
  { name: "Builders", url: "https://www.builders.co.za", enabled: true },
  { name: "Leroy Merlin", url: "https://leroymerlin.co.za", enabled: true },
  { name: "Chamberlains", url: "https://www.chamberlains.co.za", enabled: true },
  { name: "Cashbuild", url: "https://www.cashbuild.co.za", enabled: true },
];

// Main Component
export default function SearchSource() {
  const [sources, setSources] = useState([...PRELOADED_SOURCES]);
  const [newSource, setNewSource] = useState({ name: "", url: "" });

  const handleInputChange = (e) => {
    setNewSource({ ...newSource, [e.target.name]: e.target.value });
  };

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSource.name.trim() || !newSource.url.trim()) return;
    setSources([
      ...sources,
      { name: newSource.name.trim(), url: newSource.url.trim(), enabled: true },
    ]);
    setNewSource({ name: "", url: "" });
  };

  const handleToggle = (index) => {
    setSources((prev) =>
      prev.map((src, i) => i === index ? { ...src, enabled: !src.enabled } : src)
    );
  };

  const handleDelete = (index) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="ss-container">
      <div className="ss-main">
        <h2 className="ss-header">Product Source Setup</h2>
        <SourceForm
          newSource={newSource}
          onChange={handleInputChange}
          onSubmit={handleAddSource}
        />
        <SourceTable
          sources={sources}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        <ActionButtons />
      </div>
    </div>
  );
}
