import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "../Home/Home.css";
import instance from "../../components/Axios-Instance";
import "react-confirm-alert/src/react-confirm-alert.css";
import { RiDashboard2Fill } from "react-icons/ri";
import { AiOutlineShoppingCart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiGroup } from "react-icons/bi";

import { Space } from "antd";

function Home() {
  const [allData, setAllData] = useState(null);
  const [allCustomers, setAllCustomers] = useState(null);
  const [allOrders, setAllOrders] = useState(null);
  const token = localStorage.getItem("JWT-Token");

  useEffect(() => {
    instance
      .get("Dashboard/user-count.php")
      .then((response) => {
        setAllData(response.data);
      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });

    instance
      .get("Dashboard/customer-count.php")
      .then((response) => {
        setAllCustomers(response.data);
      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });

    instance
      .get("Dashboard/order-count.php")
      .then((response) => {
        setAllOrders(response.data);
      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });
  }, []);

  return (
    <div className="bstore-body">
      <HeaderBstore />
      <div className=" bstore-heading">
        <RiDashboard2Fill /> Dashboard
      </div>
      <div className="row">
        <div className="col-2 menu">
          <Sidebar />
        </div>
      </div>
      <div className="align">
        <div className="row">
          <div className="col-4">
            <div className="block1 ">
              <div className="col-5">
                <div className="dash-icon">
                  <BiGroup />
                </div>
              </div>
              <Space />
              <div className="col-7">
                <h2>
                  <div className="users-count">{allData}</div>
                  Users
                </h2>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="block3">
              <div className="col-5">
                <div className="dash-icon">
                  <AiOutlineShoppingCart />
                </div>
              </div>
              <div className="col-7">
                <h2>
                  <div className="order-count">{allOrders}</div> Orders
                </h2>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="block2">
              <div className="col-5">
                <div className="dash-icon">
                  <AiOutlineUsergroupAdd />
                </div>
              </div>
              <div className="col-7">
                <h2>
                  <div className="cust-count">{allCustomers}</div>
                  Customers
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
