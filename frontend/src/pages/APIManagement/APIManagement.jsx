import React, { useState, useCallback } from 'react';
import './APIManagement.css';

// Hardcoded demo data
const DEMO_APIS = [
  { id: 1, apiName: 'Takealot', apiUrl: 'https://www.takealot.co.za', apiKey: 'MjCRdsZ2gOH7eudy', enable: 'Yes' },
  { id: 2, apiName: 'Amazon South Africa', apiUrl: 'https://www.amazon.co.za', apiKey: 'aLUArp9zHFEcMLmA', enable: 'Yes' },
  { id: 3, apiName: 'Makro', apiUrl: 'https://www.makro.co.za', apiKey: 'ogJDOXuc2si5b00l', enable: 'Yes' },
  { id: 4, apiName: 'Waltons', apiUrl: 'https://www.waltons.co.za', apiKey: '5I7XMPoqzDFpFn4c', enable: 'Yes' },
  { id: 5, apiName: 'HiFi Corp', apiUrl: 'https://www.hificorp.co.za', apiKey: 'vrCFEnkey2qBlkLy', enable: 'Yes' },
  { id: 6, apiName: 'Incredible Connection', apiUrl: 'https://www.incredible.co.za', apiKey: 'Moudjvy0saKqZrvW', enable: 'Yes' },
  { id: 7, apiName: 'Game', apiUrl: 'https://www.game.co.za', apiKey: 'OdW277N4V4yIkt32', enable: 'Yes' },
  { id: 8, apiName: 'Checkers', apiUrl: 'https://www.checkers.co.za', apiKey: 'CLGd7iB9O9OPRMGU', enable: 'Yes' },
  { id: 9, apiName: 'Pick n Pay', apiUrl: 'https://www.pnp.co.za', apiKey: 'zYHscrguvWpYanLv', enable: 'Yes' },
  { id: 10, apiName: 'Woolworths', apiUrl: 'https://www.woolworths.co.za', apiKey: 'VNQ3KWBdPTZASnbK', enable: 'Yes' },
  { id: 11, apiName: 'Builders', apiUrl: 'https://www.builders.co.za', apiKey: 'lPd5Dolw5yGdldoH', enable: 'Yes' },
  { id: 12, apiName: 'Leroy Merlin', apiUrl: 'https://leroymerlin.co.za', apiKey: '7b2fKo7q3ePteYRj', enable: 'Yes' },
  { id: 13, apiName: 'Chamberlains', apiUrl: 'https://www.chamberlains.co.za', apiKey: 'NPwYE9yTF70FteUG', enable: 'Yes' },
  { id: 14, apiName: 'Cashbuild', apiUrl: 'https://www.cashbuild.co.za', apiKey: 'QAOFa01HlFGjEO7k', enable: 'Yes' },
];

const initialForm = {
  apiName: '',
  apiUrl: '',
  apiKey: '',
  enable: 'Yes',
};

const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url.replace(/^\/+/, '');
  }
  return url;
};

const APIManagement = () => {
  const [formData, setFormData] = useState(initialForm);
  const [apiList, setApiList] = useState([...DEMO_APIS]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Form handlers
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isDuplicateUrl = (url) => {
    return apiList.some(
      (api) =>
        api.apiUrl.toLowerCase() === url.toLowerCase() &&
        (!isEditing || api.id !== editId)
    );
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const url = normalizeUrl(formData.apiUrl);

      if (!formData.apiName.trim() || !formData.apiUrl.trim() || !formData.apiKey.trim()) {
        setError('All fields are required.');
        return;
      }

      if (!isValidUrl(url)) {
        setError('Please enter a valid URL.');
        return;
      }

      if (isDuplicateUrl(url)) {
        setError('This API URL already exists.');
        return;
      }

      if (isEditing) {
        setApiList((prevList) =>
          prevList.map((api) =>
            api.id === editId ? { ...api, ...formData, apiUrl: url } : api
          )
        );
        setMessage('API updated successfully!');
      } else {
        const newApi = {
          id: apiList.length > 0 ? Math.max(...apiList.map((api) => api.id)) + 1 : 1,
          ...formData,
          apiUrl: url,
        };
        setApiList((prevList) => [...prevList, newApi]);
        setMessage('API added successfully!');
      }

      setFormData(initialForm);
      setIsEditing(false);
      setEditId(null);
      setTimeout(() => setMessage(''), 2000);
    },
    [formData, apiList, isEditing, editId]
  );

  const handleEdit = useCallback(
    (id) => {
      const apiToEdit = apiList.find((api) => api.id === id);
      if (apiToEdit) {
        setFormData({
          apiName: apiToEdit.apiName,
          apiUrl: apiToEdit.apiUrl,
          apiKey: apiToEdit.apiKey,
          enable: apiToEdit.enable,
        });
        setIsEditing(true);
        setEditId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [apiList]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this API?')) {
        setApiList((prevList) => prevList.filter((api) => api.id !== id));
        setMessage('API deleted successfully!');
        if (isEditing && editId === id) {
          setFormData(initialForm);
          setIsEditing(false);
          setEditId(null);
        }
        setTimeout(() => setMessage(''), 2000);
      }
    },
    [isEditing, editId]
  );

  const handleCancel = useCallback(() => {
    setFormData(initialForm);
    setIsEditing(false);
    setEditId(null);
    setError('');
  }, []);

  // Reset to demo data
  const handleResetDemo = () => {
    setApiList([...DEMO_APIS]);
    setFormData(initialForm);
    setIsEditing(false);
    setEditId(null);
    setError('');
    setMessage('Demo data restored!');
    setTimeout(() => setMessage(''), 2000);
  };

  const isFormValid =
    formData.apiName.trim() &&
    formData.apiUrl.trim() &&
    formData.apiKey.trim() &&
    isValidUrl(normalizeUrl(formData.apiUrl)) &&
    !isDuplicateUrl(normalizeUrl(formData.apiUrl));

  const truncate = (str, n = 30) => (str.length > n ? str.slice(0, n) + '…' : str);

  const filteredApiList = apiList.filter(
    (api) =>
      api.apiName.toLowerCase().includes(search.toLowerCase()) ||
      api.apiUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="api-management-content">
      <div className="header">API Management</div>

      <div className="form-container">
        <form id="api-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="api-name">API Name</label>
            <input
              type="text"
              id="api-name"
              name="apiName"
              value={formData.apiName}
              onChange={handleInputChange}
              maxLength="50"
              placeholder="Enter API Name"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="api-url">API URL</label>
            <input
              type="url"
              id="api-url"
              name="apiUrl"
              value={formData.apiUrl}
              onChange={handleInputChange}
              maxLength="100"
              placeholder="Enter API URL"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="api-key">API Key</label>
            <input
              type="text"
              id="api-key"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              maxLength="100"
              placeholder="Enter API Key"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label>Enable API</label>
            <div className="radio-group">
              <input
                type="radio"
                id="enable-yes"
                name="enable"
                value="Yes"
                checked={formData.enable === 'Yes'}
                onChange={handleInputChange}
              />
              <label htmlFor="enable-yes">Yes</label>

              <input
                type="radio"
                id="enable-no"
                name="enable"
                value="No"
                checked={formData.enable === 'No'}
                onChange={handleInputChange}
              />
              <label htmlFor="enable-no">No</label>
            </div>
          </div>

          {error && <div className="form-error" aria-live="polite">{error}</div>}
          {message && <div className="form-message" aria-live="polite">{message}</div>}

          <div className="button-group">
            <button type="submit" className="btn-submit" disabled={!isFormValid}>
              {isEditing ? 'Update' : 'Submit'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <button
        style={{ marginBottom: 10 }}
        onClick={handleResetDemo}
        className="btn-reset"
      >
        Reset
      </button>

      <div className="table-container">
        {filteredApiList.length === 0 ? (
          <p>No APIs available. Please add some.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>API Name</th>
                <th>URL</th>
                <th>Key</th>
                <th>Enable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="api-table-body">
              {filteredApiList.map((api, index) => (
                <tr key={api.id} className={editId === api.id ? 'editing-row' : ''}>
                  <td>{index + 1}</td>
                  <td>{truncate(api.apiName, 20)}</td>
                  <td>
                    <a
                      href={api.apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="api-link"
                    >
                      {truncate(api.apiUrl, 32)}
                    </a>
                  </td>
                  <td>{truncate(api.apiKey, 16)}</td>
                  <td>{api.enable}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(api.id)}
                      aria-label={`Edit ${api.apiName}`}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(api.id)}
                      aria-label={`Delete ${api.apiName}`}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default APIManagement;
