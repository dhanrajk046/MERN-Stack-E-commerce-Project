const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");
const { generateReviewDigest, generateProductDescription } = require("../utils/aiService");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    }
    return res.status(404).json({ message: "Product not found" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  let imageUrl = req.body.imageUrl || "";

  try {
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all product details" });
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "shopnest/products",
      });
      imageUrl = uploadResult.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "A product image is required" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unable to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "shopnest/products",
      });
      product.imageUrl = uploadResult.secure_url;
    }

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Unable to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Unable to delete product" });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: String(comment).trim(),
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    const digest = await generateReviewDigest(product.name, product.reviews);
    product.aiSummary = digest.summary;
    product.aiSentiment = digest.sentiment;
    product.aiTrustScore = digest.trustScore;

    await product.save();
    return res.status(201).json({ message: "Review added", reviews: product.reviews });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Server error, failed to submit review" });
  }
};

const generateDescription = async (req, res) => {
  const { name, category, keypoints } = req.body;

  try {
    if (!name || !category) {
      return res.status(400).json({ message: "Product name and category are required for AI generation" });
    }

    const description = await generateProductDescription(name, category, keypoints);
    return res.json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    return res.status(500).json({ message: "Server error, failed to generate description" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  generateDescription,
};
