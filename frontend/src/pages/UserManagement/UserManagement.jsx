import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const roles = ['Admin', 'View'];
const genders = ['Male', 'Female', 'Other'];

const initialForm = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  role: '',
  email: '',
  phone: '',
  password: '',
};

const validateEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = phone =>
  /^\d{10,15}$/.test(phone);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender ||
      !formData.dob ||
      !formData.role ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError('All required fields must be filled.');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Invalid email address.');
      return false;
    }
    if (!validatePhone(formData.phone)) {
      setError('Invalid phone number.');
      return false;
    }
    return true;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data); // Adjust based on API response structure
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage('User saved successfully!');
        fetchUsers();
        setFormData(initialForm);
        setSelectedUserId(null);
      } else {
        setError(result.error || 'Error saving user.');
      }
    } catch (err) {
      setError('Error saving user.');
      console.error(err);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('User deleted.');
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.error || 'Error deleting user.');
      }
    } catch (err) {
      setError('Error deleting user.');
    }
  };

  const handleEdit = (user) => {
    setSelectedUserId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob,
      role: user.role,
      email: user.email,
      phone: user.phone,
      password: '',
    });
    setMessage('');
    setError('');
  };

  const handleToggleStatus = (userId) => {
    setMessage('Status toggled (mock)');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setSelectedUserId(null);
    setError('');
    setMessage('');
  };

  return (
    <div className="um-container">
      <h1 className="um-title">User Management</h1>
      <form className="um-form" onSubmit={handleSave} autoComplete="off">
        <div className="um-row">
          <div className="um-form-group">
            <label>First Name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div className="um-form-group">
            <label>Last Name *</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="um-row">
          <div className="um-form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} required>
              <option value="" disabled>Select</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="um-form-group">
            <label>Date of Birth *</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="um-row">
          <div className="um-form-group">
            <label>User Role *</label>
            <select name="role" value={formData.role} onChange={handleInputChange} required>
              <option value="" disabled>Select</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="um-form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="um-form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="um-row">
          <div className="um-form-group">
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          </div>
        </div>
        {error && <div className="um-error">{error}</div>}
        {message && <div className="um-message">{message}</div>}
        <button type="submit" className="um-save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'SAVE'}
        </button>
        <button type="button" className="um-cancel-btn" onClick={handleCancel}>CANCEL</button>
      </form>

      <div className="um-table-wrapper">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.gender}</td>
                <td>{user.dob}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td><span className="um-status-active">Active</span></td>
                <td>
                  <button className="um-click-btn" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="um-delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                  <button className="um-toggle-btn" onClick={() => handleToggleStatus(user.id)}>Disable</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;