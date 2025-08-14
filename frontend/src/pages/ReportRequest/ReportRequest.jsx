import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ReportRequest.css";
import { assets } from "../../assets/assets";

const getGoogleDriveFileId = (shareableLink) => {
  const match = shareableLink.match(/\/d\/([a-zA-Z0-9_-]+)(?:[\/?]|$)/);
  return match ? match[1] : null;
};

const newFileId = getGoogleDriveFileId("https://drive.google.com/file/d/1QJSfazrIiZVz1LPQzladm1_Ep0JBxMFJ/view?usp=sharing");

// 1st row stays hardcoded to help users understand
const initialRequests = [
  {
    requestId: "REQ_20250412_0001",
    category: "office",
    product: "Dairy 500 pages",
    status: "Complete",
    report: "RPT_0001",
    download: newFileId,
  }
];

export default function ReportRequest() {
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [requests, setRequests] = useState(initialRequests);
const [loading, setLoading] = useState(false);


  // Chatbot states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const messagesEndRef = useRef(null);

  const BASE_URL = "https://qbittech-3.onrender.com/api/report-requests";

  // Fetch requests from Flask backend (excluding demo)
  useEffect(() => {
    axios.get(BASE_URL)
      .then(res => {
        const backendRequests = res.data;
        setRequests([...initialRequests, ...backendRequests]);
      })
      .catch(err => console.error("Error fetching backend requests:", err));
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const newRequest = {
    requestId: `REQ_${Date.now()}`,
    category,
    product,
    status: "Unassigned",
    report: "",
    download: false,
  };

  try {
    await axios.post(BASE_URL, newRequest);
    const res = await axios.get(BASE_URL);
    const updated = res.data;
    setRequests([...initialRequests, ...updated]);
  } catch (err) {
    console.error("Error submitting request:", err);
  } finally {
    setLoading(false);
  }
};


  const handleDownload = (fileId, fileName) => {
    if (!fileId) return;
    const link = document.createElement('a');
    link.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleChat = () => setShowChat(!showChat);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    const newUserMessage = { sender: "user", text: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput("");

    setTimeout(() => {
      const botResponse = {
        sender: "bot",
        text: "Hello! Thanks for reaching out. How can I assist you with your report requests today?",
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Report Request</h1>
        <div className="userProfile">
          <img src={assets.profile_icon || ''} alt="User profile" className="avatar" />
          <span className="userName">Akshar Rampath</span>
        </div>
      </header>

      <div className="requestInfo">
        <span className="label">Active Request ID:</span>
        <span className="requestId">
          REQ_NBK_{new Date().toISOString().slice(0, 10).replace(/-/g, "")}_0001
        </span>
      </div>

      <form className="requestForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="category" className="formLabel">Product Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="formSelect"
            required
          >
            <option value="">Select Category</option>
            <option value="office">Office Supplies</option>
            <option value="tech">Technology</option>
            <option value="furniture">Furniture</option>
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="product" className="formLabel">Description</label>
          <input
            id="product"
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="formInput"
            required
          />
        </div>

<button type="submit" className="submitButton" disabled={loading}>
  {loading ? "Submitting..." : "Create Request"}
</button>

      </form>

      <div className="tableWrapper">
        <table className="responsiveTable">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Category</th>
              <th>Status</th>
              <th>Report</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.requestId}>
                <td>{request.requestId}</td>
                <td>{request.category}</td>
                <td>
                  <span className={`statusBadge ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.report && request.download ? (
                    <a
                      href={`https://drive.google.com/file/d/${request.download}/view`}
                      className="reportLink"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {request.report}
                    </a>
                  ) : (
                    <span className="pendingLabel">Pending</span>
                  )}
                </td>
                <td>
                  {request.download ? (
                    <button
                      className="downloadButton"
                      onClick={() => handleDownload(request.download, `${request.product || 'Report'}_${request.requestId}.pdf`)}
                    >
                      ↓ Download
                    </button>
                  ) : (
                    <span className="pendingLabel">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="notes">
        <h2 className="notesTitle">System Guidelines</h2>
        <ul className="noteList">
          <li>All request IDs are generated automatically using ISO timestamp standards.</li>
          <li>Product selection reflects current inventory configuration.</li>
          <li>Report availability depends on completion of quality checks.</li>
        </ul>
      </section>

      {/* --- Chatbot UI --- */}
      <div className={`chat-widget ${showChat ? 'open' : ''}`}>
        {showChat && (
          <div className="chat-window">
            <div className="chat-header">
              <h3>AI Assistant</h3>
              <button className="chat-close-btn" onClick={toggleChat}>×</button>
            </div>
            <div className="chat-messages">
              {chatMessages.length === 0 && (
                <div className="chat-welcome">Welcome! How can I help you today?</div>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </form>
          </div>
        )}
        <button className="chat-toggle-btn" onClick={toggleChat}>
          <img src={assets.chat_icon || ''} alt="Chat" />
        </button>
      </div>
    </div>
  );
}
