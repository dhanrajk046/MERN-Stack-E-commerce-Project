import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    if (user?.token) fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    if (!user?.token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const updatedOrder = await response.json();
      if (!response.ok)
        throw new Error(updatedOrder.message || "Unable to update order");
      setOrders((current) =>
        current.map((order) => (order._id === id ? updatedOrder : order)),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const formatPrice = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>Manage Orders</h2>
      {error && (
        <p style={{ color: "#fca5a5", marginBottom: "16px" }}>{error}</p>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={rowStyle}>
                <td style={tdStyle}>
                  {order.orderId || `${order._id.substring(0, 8)}…`}
                </td>
                <td style={tdStyle}>{order.user?.name || "Deleted User"}</td>
                <td style={tdStyle}>₹{formatPrice(order.totalPrice)}</td>
                <td style={tdStyle}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td style={tdStyle}>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateStatus(order._id, event.target.value)
                    }
                    style={selectStyle}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!error && orders.length === 0 && (
        <p style={{ color: "#a1a1aa", marginTop: "20px" }}>No orders yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "30px",
  background: "#18181b",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
  color: "#fafafa",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "700px",
};
const rowStyle = { borderBottom: "1px solid rgba(255,255,255,0.1)" };
const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#a1a1aa",
  fontSize: "0.9rem",
};
const tdStyle = { padding: "15px", textAlign: "left" };
const selectStyle = {
  background: "#09090b",
  color: "#fff",
  padding: "6px",
  border: "1px solid #27272a",
  borderRadius: "4px",
  outline: "none",
};

export default AdminOrders;
