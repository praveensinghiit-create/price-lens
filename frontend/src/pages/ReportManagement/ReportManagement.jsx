import React, { useState, useEffect } from "react";
import "./ReportManagement.css";
import { assets } from "../../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusOptions = ["Unassigned", "Inprogress", "Complete", "Rejected"];

export default function ReportManagement() {
  const [requests, setRequests] = useState([
    {
      requestId: "REQ_20250412_0001",
      category: "office",
      product: "Dairy 500 pages",
      status: "Complete",
      report: "RPT_0001",
      download: true,
      assignedTo: "Akshar Rampath",
    },
  ]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchUsers();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://qbittech-3.onrender.com/api/report-requests");
      const data = await res.json();
      const filtered = data.filter((r) => r.requestId !== "REQ_20250412_0001");
      setRequests((prev) => [...prev, ...filtered]);
    } catch (err) {
      toast.error("Failed to fetch report requests");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://qbittech-3.onrender.com/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setLoading(requestId);
    try {
      await fetch(`https://qbittech-3.onrender.com/api/report-requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setRequests((reqs) =>
        reqs.map((r) =>
          r.requestId === requestId
            ? {
                ...r,
                status: newStatus,
                download: newStatus === "Complete",
                report: newStatus === "Complete" ? r.report || "RPT_" + requestId.slice(-4) : "",
              }
            : r
        )
      );
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleAssignment = async (requestId, newAssignee) => {
    setRequests((reqs) =>
      reqs.map((r) => (r.requestId === requestId ? { ...r, assignedTo: newAssignee } : r))
    );
    if (requestId !== "REQ_20250412_0001") {
      try {
        await fetch(`https://qbittech-3.onrender.com/api/report-requests/${requestId}/assign`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignedTo: newAssignee }),
        });
        toast.success(`Assigned to ${newAssignee}`);
      } catch (err) {
        toast.error("Failed to assign request");
      }
    }
  };

  const handleTriggerEmail = async (request) => {
    setLoading(request.requestId);
    try {
      const res = await fetch("https://qbittech-3.onrender.com/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "praveensinghiit@gmail.com",
          subject: `Report Update: ${request.product}`,
          body: `Hello,\n\nThis is to notify you about the status of your request (${request.requestId}) for "${request.product}".\n\nCurrent status: ${request.status}.\nAssigned to: ${request.assignedTo || "Unassigned"}.\n\nThank you.`,
        }),
      });
      if (res.ok) {
        toast.success(`Email sent for ${request.requestId}`);
      } else {
        const data = await res.json();
        toast.error(`❌ Email failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      toast.error(`🚨 Error sending email: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Report Management</h1>
        <div className="userProfile">
          <img src={assets} alt="User profile" className="avatar" />
          <span className="userName">Akshar Rampath</span>
        </div>
      </header>
      <div className="tableWrapper">
        <table className="responsiveTable">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Category</th>
              <th>Product</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Report</th>
              <th>Download</th>
              <th>Action</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.requestId}>
                <td>{request.requestId}</td>
                <td>{request.category}</td>
                <td>{request.product}</td>
                <td>
                  <span className={`statusBadge ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <select
                    value={request.assignedTo || ""}
                    onChange={(e) => handleAssignment(request.requestId, e.target.value)}
                    className="formSelect"
                    disabled={loading === request.requestId}
                  >
                    <option value="">Select</option>
                    {users.map((u) => (
                      <option key={u.id} value={`${u.firstName} ${u.lastName}`}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {request.report ? (
                    <a href={`#${request.report}`} className="reportLink">
                      {request.report}
                    </a>
                  ) : (
                    <span className="pendingLabel">Pending</span>
                  )}
                </td>
                <td>
                  {request.download ? (
                    <button className="downloadButton">
                      <span aria-hidden="true">↓</span> Download
                    </button>
                  ) : (
                    <span className="pendingLabel">Pending</span>
                  )}
                </td>
                <td>
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.requestId, e.target.value)}
                    className="formSelect"
                    disabled={loading === request.requestId}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="triggerEmailButton"
                    onClick={() => handleTriggerEmail(request)}
                    disabled={loading === request.requestId}
                  >
                    {loading === request.requestId ? (
                      <div className="spinner"></div>
                    ) : (
                      "Trigger Email"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="notes">
        <h2 className="notesTitle">System Guidelines</h2>
        <ul className="noteList">
          <li>The first row is a reference for clarity.</li>
          <li>Assigned To dropdown fetches live users.</li>
          <li>Status updates trigger backend synchronization.</li>
          <li>Trigger Email sends a notification for report.</li>
        </ul>
      </section>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}


