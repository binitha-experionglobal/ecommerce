import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space } from "antd";
import {
  RiDashboard2Fill,
  RiTeamFill,
  RiLogoutCircleRLine,
  RiListCheck2,
  RiShoppingCartFill,
  RiTeamLine,
} from "react-icons/ri";

function Sidebar() {
  const sidebarCollapsed = localStorage.getItem("sidebar-collapsed");
  const [isExpanded, setIsExpanded] = useState(sidebarCollapsed ? false : true);
  const handleToggler = () => {
    if (isExpanded) {
      setIsExpanded(false);
      localStorage.setItem("sidebar-collapsed", true);
      return;
    }
    setIsExpanded(true);
    localStorage.removeItem("sidebar-collapsed");
  };
  const navigate = useNavigate();

  const Dashboard = (event) => {
    event.preventDefault();
    navigate("/home");
  };

  const orders = (event) => {
    event.preventDefault();
    navigate("/home/orders");
  };

  const customers = (event) => {
    event.preventDefault();
    navigate("/home/customers");
  };

  const users = (event) => {
    event.preventDefault();
    navigate("/home/users");
  };

  const categories = (event) => {
    event.preventDefault();
    navigate("/home/categories");
  };

  const products = (event) => {
    event.preventDefault();
    navigate("/home/products");
  };

  const logout = (event) => {
    localStorage.clear();
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className={isExpanded ? "Sidebar" : "Sidebar collapsed"}>
      <br />
      <div className="sidebar-header">
        {/* <RiMenuLine className="sidebar-icon" onClick={handleToggler}/> */}
        <h1 className="sidebar-logo">
          B-Store Admin <Space />{" "}
        </h1>
      </div>
      <div className="sidebar-items">
        <div className="item" onClick={Dashboard}>
          <RiDashboard2Fill className="sidebar-icon" />
          <div className="sidebar-text">Dashboard</div>
        </div>
        <div className="item" onClick={users}>
          <RiTeamLine className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </div>
        <div className="item" onClick={customers}>
          <RiTeamFill className="sidebar-icon" />
          <span className="sidebar-text">Customers</span>
        </div>
        <div className="item" onClick={orders}>
          <RiShoppingCartFill className="sidebar-icon" />
          <span className="sidebar-text">Orders</span>
        </div>
        <div className="item" onClick={categories}>
          <RiListCheck2 className="sidebar-icon" />
          <span className="sidebar-text">Categories</span>
        </div>
        <div className="item" onClick={logout}>
          <RiLogoutCircleRLine className="sidebar-icon" />
          <span className="sidebar-text">Logout</span>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
