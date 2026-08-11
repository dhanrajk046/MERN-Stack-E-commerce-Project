import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../services/api";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleAiGenerate = async () => {
    if (!formData.name || !formData.category) {
      alert("Please enter the Product Name and Category first so the AI can generate a relevant description.");
      return;
    }
    setAiGenerating(true);
    try {
      const res = await productsApi.generateDescription(formData.name, formData.category);
      setFormData((prev) => ({ ...prev, description: res.description }));
    } catch (error) {
      alert(error.message || "Failed to generate AI description.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    if (!user?.token) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: data,
      });
      const responseData = await res.json();

      if (res.ok) {
        alert("Product created successfully with Cloudinary Image URL!");
        navigate("/shop");
      } else {
        alert(responseData.message || "Error creating product");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-panel">
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />
        
        {/* AI Description Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>Description</label>
            <button
              type="button"
              onClick={handleAiGenerate}
              className="btn"
              style={{ padding: "6px 12px", fontSize: "0.82rem", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", boxShadow: "0 2px 8px rgba(234, 88, 12, 0.2)" }}
              disabled={aiGenerating}
            >
              {aiGenerating ? "Generating..." : "🪄 Generate with Grok AI"}
            </button>
          </div>
          <textarea
            placeholder="Detailed product descriptions and key selling points..."
            required
            rows="5"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <input
          type="number"
          placeholder="Price"
          required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          required
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          required
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          style={inputStyle}
        />

        <div
          style={{
            padding: "15px",
            border: "1px dashed #f97316",
            borderRadius: "8px",
          }}
        >
          <label
            style={{ display: "block", marginBottom: "10px", color: "#a1a1aa" }}
          >
            Upload Product Image (Cloudinary)
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: "#fff" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ marginTop: "10px" }}
        >
          {loading ? "Uploading & Creating..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

export default AddProduct;
