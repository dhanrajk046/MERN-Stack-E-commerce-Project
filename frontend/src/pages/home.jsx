import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to ShopNest</h1>
      <p>Your one-stop shop for all your needs!. Explore our wide range of Products and buy at discount price.</p>
      <Link to="/shop" className="btn">Start Shopping</Link>
    </div>
  );
};


export default Home;
