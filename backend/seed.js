require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./Model/Product");
const User = require("./Model/User");

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Over-ear headphones with clear sound, soft ear cushions, and 30-hour battery life.",
    price: 2499,
    category: "Electronics",
    stock: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 18,
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable regular-fit cotton t-shirt for everyday wear.",
    price: 699,
    category: "Fashion",
    stock: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    numReviews: 32,
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated 750 ml water bottle that keeps drinks cold or hot for hours.",
    price: 899,
    category: "Home & Kitchen",
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 21,
  },
  {
    name: "Minimal Desk Lamp",
    description:
      "Adjustable LED desk lamp with three brightness levels and USB charging.",
    price: 1599,
    category: "Home & Kitchen",
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    numReviews: 14,
  },
  {
    name: "Everyday Running Shoes",
    description:
      "Lightweight running shoes with breathable mesh upper and cushioned sole.",
    price: 3299,
    category: "Fashion",
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    numReviews: 27,
  },
  {
    name: "Portable Power Bank 10000mAh",
    description: "Compact fast-charging power bank with dual USB output ports.",
    price: 1899,
    category: "Electronics",
    stock: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1609592424824-4fbd6a1225ce?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    numReviews: 19,
  },
];

const ensureUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const updates = {};
    const isPlainPassword = !existingUser.password?.startsWith?.("$2");
    const passwordMismatch =
      isPlainPassword ||
      !(await bcrypt.compare(password, existingUser.password));

    if (existingUser.name !== name) updates.name = name;
    if (existingUser.role !== role) updates.role = role;
    if (passwordMismatch) updates.password = await bcrypt.hash(password, 12);

    if (Object.keys(updates).length > 0) {
      return User.findByIdAndUpdate(
        existingUser._id,
        { $set: updates },
        { new: true },
      );
    }
    return existingUser;
  }

  return User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role,
    verified: true,
  });
};

const seed = async () => {
  try {
    await connectDB();

    await Promise.all(
      products.map((product) =>
        Product.findOneAndUpdate(
          { name: product.name },
          { $set: product },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        ),
      ),
    );

    await ensureUser({
      name: "ShopNest Admin",
      email: "admin@shopnest.com",
      password: "password123",
      role: "admin",
    });
    await ensureUser({
      name: "Demo Customer",
      email: "customer@shopnest.test",
      password: "Customer@12345",
      role: "user",
    });

    console.log(
      `Seed complete: ${products.length} sample products are available.`,
    );
    console.log("Demo admin: admin@shopnest.com / password123");
    console.log("Demo customer: customer@shopnest.test / Customer@12345");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
