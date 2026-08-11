import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
      });
    };
    fetchProduct();
  }, [id, user, navigate]);

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
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    if (image) data.append("image", image);

    if (!user?.token) {
      alert("Authorization required. Please log in again.");
      navigate("/login");
      return;
    }

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` },
      body: data,
    });
    setLoading(false);
    if (res.ok) {
      alert("Product updated successfully!");
      navigate("/admin/products");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-form-panel">
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>Edit Product</h2>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
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
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Stock"
          required
          value={formData.stock}
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
            Replace Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
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
          {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;
