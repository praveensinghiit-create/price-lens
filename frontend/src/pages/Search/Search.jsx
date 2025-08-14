import React, { useState } from "react";
import GoogleSearchForm from "../../components/GoogleSearchForm";
import GoogleSearchResultsDisplay from "../../components/GoogleSearchResultsDisplay";
import apiService from "../../services/apiService";
import "./Search.css"; // Make sure this is imported

const Search = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    setCurrentSearchQuery(params.query);

    try {
      const response = await apiService.searchGoogle({
        query: params.query,
        category: params.category,
      });
      setResults(response.data.results);
    } catch (err) {
      setError(
        "Failed to fetch search results. Please check your network and API key."
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResults(null);
    setSelectedProduct(null);
    setError(null);
    setCurrentSearchQuery("");
  };

  return (
    <div className="search-main-container">
      <div className="search-card">
        <h1 className="search-heading">Product/Service Search</h1>
        <GoogleSearchForm
          onSearch={handleSearch}
          loading={loading}
          onClear={handleClear}
        />
        {error && (
          <div className="search-alert search-alert-danger">
            <strong>Error:</strong> {error}
          </div>
        )}
        {loading && (
          <div className="search-loader-wrapper">
            <div className="search-spinner-border" role="status" />
            <p className="search-loading-text">Searching...</p>
          </div>
        )}
        {!loading && results && (
          <div className="search-results">
            <GoogleSearchResultsDisplay
              results={results}
              query={currentSearchQuery}
              onProductSelect={setSelectedProduct}
            />
          </div>
        )}
        {!loading &&
          !error &&
          results &&
          !results.shopping_results?.length &&
          currentSearchQuery && (
            <p className="search-no-results-message">
              No shopping results found for "{currentSearchQuery}".
            </p>
          )}
      </div>
    </div>
  );
};

export default Search;
