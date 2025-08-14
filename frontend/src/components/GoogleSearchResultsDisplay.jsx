import React, { useMemo, useState } from "react";
import './GoogleSearchResultsDisplay.css'

const parsePrice = (priceString) => {
  if (!priceString) return null;
  const stringToParse = String(priceString);
  const numericString = stringToParse.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? null : parsed;
};

const GoogleSearchResultsDisplay = ({ results, query }) => {
  const { shopping_results = [] } = results;
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const benchmarkData = useMemo(() => {
    if (shopping_results.length === 0) {
      return null;
    }

    const validPrices = shopping_results
      .map((item) => parsePrice(item.extracted_price))
      .filter((price) => price !== null);

    if (validPrices.length === 0) {
      return {
        productName: query || "N/A",
        priceRange: "N/A",
        averagePrice: "N/A",
        medianPrice: "N/A",
        modePrice: "N/A",
        representativeProduct: shopping_results[0] || null,
      };
    }

    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    const priceRange = `R ${minPrice.toFixed(2)} - R ${maxPrice.toFixed(2)}`;

    const sumPrices = validPrices.reduce((sum, price) => sum + price, 0);
    const averagePrice = (sumPrices / validPrices.length).toFixed(2);

    const sortedPrices = [...validPrices].sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);
    const medianPrice =
      sortedPrices.length % 2 === 0
        ? ((sortedPrices[mid - 1] + sortedPrices[mid]) / 2).toFixed(2)
        : sortedPrices[mid].toFixed(2);

    const priceCounts = {};
    validPrices.forEach((price) => {
      priceCounts[price] = (priceCounts[price] || 0) + 1;
    });
    let modePrice = "N/A";
    let maxCount = 0;
    for (const price in priceCounts) {
      if (priceCounts[price] > maxCount) {
        maxCount = priceCounts[price];
        modePrice = parseFloat(price).toFixed(2);
      }
    }
    const benchmarkProductName = query || "Product";
    const sources = "";

    return {
      productName: benchmarkProductName,
      priceRange,
      averagePrice,
      medianPrice,
      modePrice,
      sources,
      representativeProduct: shopping_results[0],
    };
  }, [shopping_results, query]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = shopping_results.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(shopping_results.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-results-container">
      <h3 className="product-results-title">Benchmark Prices</h3>
      {benchmarkData ? (
        <div className="table-responsive">
          <table className="product-results-table">
            <thead>
              <tr>
                <th>Search Query</th>
                <th>Price Range</th>
                <th>Average Price</th>
                <th>Median Price</th>
                <th>Mode Price</th>
                <th>Sources</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {benchmarkData.representativeProduct?.thumbnail && (
                      <img
                        src={benchmarkData.representativeProduct.thumbnail}
                        alt={benchmarkData.productName}
                        className="product-image-thumbnail"
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <div className="product-title-text">
                      {benchmarkData.productName}
                    </div>
                  </div>
                </td>
                <td>{benchmarkData.priceRange}</td>
                <td>
                  {benchmarkData.averagePrice !== "N/A"
                    ? `R ${benchmarkData.averagePrice}`
                    : "N/A"}
                </td>
                <td>
                  {benchmarkData.medianPrice !== "N/A"
                    ? `R ${benchmarkData.medianPrice}`
                    : "N/A"}
                </td>
                <td>
                  {benchmarkData.modePrice !== "N/A"
                    ? `R ${benchmarkData.modePrice}`
                    : "N/A"}
                </td>
                <td>{benchmarkData.sources}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-results-message">No results found for benchmark.</p>
      )}

      {shopping_results.length > 0 && (
        <>
          <h3 className="raw-listings-title" style={{ marginTop: "30px" }}>
            Product Listings
          </h3>
          <div className="table-responsive">
            <table className="raw-products-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Source</th>
                  <th>Product Link</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((item, index) => (
                  <tr key={item.link || index}>
                    <td>{indexOfFirstProduct + index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      {item.extracted_price
                        ? `R ${parsePrice(item.extracted_price).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td>{item.source || "N/A"}</td>
                    <td>
                      {item.product_link ? (
                        <a
                          href={item.product_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Product
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`pagination-button ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {shopping_results.length === 0 && (
        <p className="no-raw-results-message">
          No shopping results to display.
        </p>
      )}
    </div>
  );
};

export default GoogleSearchResultsDisplay;
