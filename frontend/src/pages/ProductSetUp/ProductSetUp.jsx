import React, { useState } from "react";
import "./ProductSetUp.css";

// 14 South African e-commerce sites
const WEBSITE_SOURCES = [
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

const DEFAULT_CATEGORIES = ["Stationary", "Electronics", "Books"];
const DEFAULT_PRODUCTS = [
  {
    category: "Stationary",
    product: "A1 Note book",
    apiMapping: "Takealot",
    sourceMapping: "Takealot, Leroy Merlin",
  },
  {
    category: "Stationary",
    product: "Ball Pen",
    apiMapping: "Takealot",
    sourceMapping: "Takealot, Game",
  },
];

export default function ProductSetUp({
  categories = DEFAULT_CATEGORIES,
  initialApiSources = WEBSITE_SOURCES,
  initialWebSources = WEBSITE_SOURCES,
  initialProducts = DEFAULT_PRODUCTS,
}) {
  const [productCategory, setProductCategory] = useState("");
  const [product, setProduct] = useState("");
  const [apiSources, setApiSources] = useState(initialApiSources);
  const [webSources, setWebSources] = useState(initialWebSources);
  const [products, setProducts] = useState(initialProducts);

  const handleToggle = (idx, sources, setSources) => {
    setSources(
      sources.map((src, i) =>
        i === idx ? { ...src, enabled: !src.enabled } : src
      )
    );
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productCategory.trim() || !product.trim()) return;
    const enabledApi = apiSources.filter(s => s.enabled).map(s => s.name).join(", ") || "None";
    const enabledWeb = webSources.filter(s => s.enabled).map(s => s.name).join(", ") || "None";
    setProducts([
      ...products,
      {
        category: productCategory,
        product: product,
        apiMapping: enabledApi,
        sourceMapping: enabledWeb,
      },
    ]);
    setProduct("");
    setProductCategory("");
  };

  const handleDeleteProduct = (index) => {
    setProducts(products => products.filter((_, idx) => idx !== index));
  };

  return (
    <main className="ps-main">
      <header>
        <h1 className="ps-title">Product Search Setup</h1>
      </header>

      <form onSubmit={handleAddProduct} autoComplete="off" className="ps-form">
        <fieldset className="ps-fieldset">
          <legend className="ps-legend">Add New Product</legend>
          <div className="ps-row">
            <label className="ps-label ps-label-category">
              Category
              <select
                value={productCategory}
                onChange={e => setProductCategory(e.target.value)}
                required
                className="ps-select"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label className="ps-label ps-label-product">
              Product Name
              <input
                type="text"
                value={product}
                onChange={e => setProduct(e.target.value)}
                required
                placeholder="Enter product name"
                className="ps-input"
              />
            </label>
          </div>
          <div className="ps-row">
            <fieldset className="ps-source-fieldset">
              <legend className="ps-source-legend">API Sources</legend>
              <div className="ps-source-list">
                {apiSources.map((src, idx) => (
                  <label key={src.name} className="ps-source-label">
                    <input
                      type="checkbox"
                      checked={src.enabled}
                      onChange={() => handleToggle(idx, apiSources, setApiSources)}
                    />
                    {src.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="ps-source-fieldset">
              <legend className="ps-source-legend">Web Sources</legend>
              <div className="ps-source-list">
                {webSources.map((src, idx) => (
                  <label key={src.name} className="ps-source-label">
                    <input
                      type="checkbox"
                      checked={src.enabled}
                      onChange={() => handleToggle(idx, webSources, setWebSources)}
                    />
                    {src.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <button type="submit" className="ps-add-btn">
            Add Product
          </button>
        </fieldset>
      </form>

      <section aria-label="Product List">
        <table className="ps-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product</th>
              <th>API Mapping</th>
              <th>Source Mapping</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr key={prod.product + idx}>
                <td>{prod.category}</td>
                <td>{prod.product}</td>
                <td>{prod.apiMapping}</td>
                <td>{prod.sourceMapping}</td>
                <td>
                  <button
                    type="button"
                    className="ps-select-btn"
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(idx)}
                    className="ps-delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <nav className="ps-btn-row">
        <button type="button" className="ps-btn ps-save-btn">Save</button>
        <button type="button" aria-label="Close" className="ps-btn ps-x-btn">×</button>
        <button type="button" className="ps-btn ps-cancel-btn">Cancel</button>
      </nav>
    </main>
  );
}
