require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./model/Product");
const User = require("./model/User");

// Sample user IDs for reviews (we will map them to the seeded customer once connected)
const getSampleReviews = (productName) => {
  return [
    {
      name: "Aarav Mehta",
      rating: 5,
      comment: `Absolutely loved this product! The quality of the ${productName} exceeded my expectations. Outstanding performance and fast delivery.`,
    },
    {
      name: "Priya Sharma",
      rating: 4,
      comment: `Very good purchase. The ${productName} works exactly as described. The finish is sleek, though shipping took an extra day.`,
    },
    {
      name: "Vikram Singh",
      rating: 4,
      comment: `Solid build quality and great utility. Use it daily. Definitely recommend it for anyone looking for reliability.`,
    },
  ];
};

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Over-ear headphones with clear sound, soft ear cushions, and 30-hour battery life.",
    price: 2499,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 3,
    reviews: getSampleReviews("Wireless Bluetooth Headphones"),
    aiSummary: "Customers consistently praise the clear sound quality and comfortable over-ear design. The 30-hour battery life is a major plus, though a few noted the fit is slightly snug.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 92,
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable regular-fit cotton t-shirt for everyday wear.",
    price: 699,
    category: "Fashion",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    numReviews: 3,
    reviews: getSampleReviews("Classic Cotton T-Shirt"),
    aiSummary: "Highly rated for its breathability and premium cotton feel. Customers report it fits true to size and washes well without shrinking. (Local AI Preview)",
    aiSentiment: "Positive",
    aiTrustScore: 86,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated 750 ml water bottle that keeps drinks cold or hot for hours.",
    price: 899,
    category: "Home & Kitchen",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 3,
    reviews: getSampleReviews("Stainless Steel Water Bottle"),
    aiSummary: "Users are extremely satisfied with the insulation, reporting that drinks stay ice-cold all day. The stainless steel body is durable and leak-proof.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 96,
  },
  {
    name: "Minimal Desk Lamp",
    description: "Adjustable LED desk lamp with three brightness levels and USB charging.",
    price: 1599,
    category: "Home & Kitchen",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    numReviews: 3,
    reviews: getSampleReviews("Minimal Desk Lamp"),
    aiSummary: "Praised for its modern, space-saving design and adjustable brightness levels. The built-in USB charger is noted as extremely convenient.",
    aiSentiment: "Positive",
    aiTrustScore: 88,
  },
  {
    name: "Everyday Running Shoes",
    description: "Lightweight running shoes with breathable mesh upper and cushioned sole.",
    price: 3299,
    category: "Fashion",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    numReviews: 3,
    reviews: getSampleReviews("Everyday Running Shoes"),
    aiSummary: "Reviews emphasize the shoe's lightweight design and excellent shock absorption. Recommended for running and daily workouts.",
    aiSentiment: "Positive",
    aiTrustScore: 86,
  },
  {
    name: "Portable Power Bank 10000mAh",
    description: "Compact fast-charging power bank with dual USB output ports.",
    price: 1899,
    category: "Electronics",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    numReviews: 3,
    reviews: getSampleReviews("Portable Power Bank 10000mAh"),
    aiSummary: "Recognized as highly portable and reliable for emergency charging. Dual output allows charging two devices at once, though charging the power bank itself takes time.",
    aiSentiment: "Positive",
    aiTrustScore: 85,
  },
  // 10 New Premium Showcase Products
  {
    name: "Smart Fitness Watch",
    description: "A premium smartwatch with heart rate monitor, step tracker, sleep analyzer, and dynamic notification widgets.",
    price: 4599,
    category: "Electronics",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 3,
    reviews: getSampleReviews("Smart Fitness Watch"),
    aiSummary: "Customers love the bright, responsive display and precise heart rate tracking. The sleep analytics are comprehensive, and battery life easily reaches 7 days.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 94,
  },
  {
    name: "Ergonomic Office Chair",
    description: "High-back mesh chair with adjustable lumbar support, 3D armrests, and dynamic reclining mechanism.",
    price: 8499,
    category: "Home & Kitchen",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    numReviews: 3,
    reviews: getSampleReviews("Ergonomic Office Chair"),
    aiSummary: "Highly praised for relieving lower back pain during long work hours. The mesh material is highly breathable and assembly is quick and straightforward.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 92,
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 hand-painted, microwave-safe ceramic mugs with comfortable heat-resistant handles.",
    price: 1299,
    category: "Home & Kitchen",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    numReviews: 3,
    reviews: getSampleReviews("Ceramic Coffee Mug Set"),
    aiSummary: "Praised for the unique, hand-painted aesthetic and sturdy build. They hold heat well, though they are slightly heavier than standard porcelain mugs.",
    aiSentiment: "Positive",
    aiTrustScore: 86,
  },
  {
    name: "Premium Yoga Mat",
    description: "6mm non-slip eco-friendly TPE yoga mat with alignment lines, perfect for yoga, pilates, and floor workouts.",
    price: 1499,
    category: "Fitness & Outdoors",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 3,
    reviews: getSampleReviews("Premium Yoga Mat"),
    aiSummary: "Outstanding grip and traction even during sweaty hot yoga sessions. The 6mm cushioning provides excellent joint protection without losing stability.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 95,
  },
  {
    name: "Chef Knife (8 inch)",
    description: "Professional high-carbon German stainless steel kitchen knife with ergonomic pakkawood handle.",
    price: 2199,
    category: "Home & Kitchen",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    numReviews: 3,
    reviews: getSampleReviews("Chef Knife (8 inch)"),
    aiSummary: "Extremely sharp out of the box and maintains its edge remarkably well. Balanced weight distribution reduces wrist fatigue during heavy chopping.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 93,
  },
  {
    name: "Compact Air Fryer",
    description: "4L capacity digital air fryer with 8 presets, touchscreen panel, and non-stick dishwasher-safe basket.",
    price: 5499,
    category: "Home & Kitchen",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    numReviews: 3,
    reviews: getSampleReviews("Compact Air Fryer"),
    aiSummary: "Praised as a game-changer for quick, healthy meals with minimal oil. The digital touch controls are intuitive, and cleaning is incredibly easy.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 94,
  },
  {
    name: "Adjustable Dumbbell Set",
    description: "Pair of dumbbells adjustable from 2.5 kg to 24 kg with a smooth dial selection mechanism.",
    price: 7999,
    category: "Fitness & Outdoors",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    numReviews: 3,
    reviews: getSampleReviews("Adjustable Dumbbell Set"),
    aiSummary: "An excellent space-saving solution that replaces a whole rack of dumbbells. The dial adjustments are fluid, and the grip feels highly secure.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 96,
  },
  {
    name: "Travel Backpack (40L)",
    description: "Water-resistant travel laptop backpack with TSA-friendly layout, USB charging port, and shoe compartment.",
    price: 2799,
    category: "Fashion",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    numReviews: 3,
    reviews: getSampleReviews("Travel Backpack (40L)"),
    aiSummary: "Highly spacious and comfortable to wear even when fully packed. The shoe compartment and USB charging port are heavily appreciated additions.",
    aiSentiment: "Positive",
    aiTrustScore: 89,
  },
  {
    name: "Organic Green Tea Pack",
    description: "100% natural organic loose leaf green tea sourced from premium high-altitude Himalayan tea gardens.",
    price: 499,
    category: "Groceries",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 3,
    reviews: getSampleReviews("Organic Green Tea Pack"),
    aiSummary: "Praised for its mild, earthy flavor and soothing aroma without being overly bitter. Customers note it helps them feel energized and focused throughout the day.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 91,
  },
  {
    name: "Ultralight Camping Tent",
    description: "Waterproof double-layer 2-person tent with aluminum poles and compact carrying bag.",
    price: 6599,
    category: "Fitness & Outdoors",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    numReviews: 3,
    reviews: getSampleReviews("Ultralight Camping Tent"),
    aiSummary: "Very lightweight and easy to carry on long hikes. Withstands wind and rain beautifully, and setup takes less than 10 minutes.",
    aiSentiment: "Highly Positive",
    aiTrustScore: 93,
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

    // Ensure demo customer & admin are seeded
    const adminUser = await ensureUser({
      name: "ShopNest Admin",
      email: "admin@shopnest.com",
      password: "password123",
      role: "admin",
    });
    const demoUser = await ensureUser({
      name: "Demo Customer",
      email: "customer@shopnest.test",
      password: "Customer@12345",
      role: "user",
    });

    // Seed products with reviews referencing our demo user
    await Promise.all(
      products.map((product) => {
        // Map user refs inside reviews
        const reviewsWithRefs = product.reviews.map((r, i) => ({
          ...r,
          user: i === 0 ? adminUser._id : demoUser._id,
        }));

        return Product.findOneAndUpdate(
          { name: product.name },
          { 
            $set: {
              ...product,
              reviews: reviewsWithRefs
            }
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        );
      }),
    );

    console.log(
      `Seed complete: ${products.length} sample products are available with reviews and AI digests.`,
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
