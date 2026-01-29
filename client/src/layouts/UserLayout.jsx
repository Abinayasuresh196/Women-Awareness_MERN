import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "./UserLayout.css";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />

      <main className="user-content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
