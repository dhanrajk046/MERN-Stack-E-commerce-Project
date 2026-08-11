const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");

const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenue] = await Promise.all(
      [
        User.countDocuments({ role: "user" }),
        Order.countDocuments({}),
        Product.countDocuments({}),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ],
    );

    return res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = { getAdminStats };
