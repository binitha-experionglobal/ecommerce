import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import "./styles.css";
import Categories from "./pages/Categories/Categories";
import Customers from "./pages/Customers/Customers";
import Orders from "./pages/Orders/Orders";
import Users from "./pages/Users/Users";
import MyProfile from "./pages/My-Profile/MyProfile";
import Notfound from "./pages/Not-Found/Notfound";
import Pro from "./pages/My-Profile/pro"
import ProtectedRoute from "./components/ProtectedRoute"

export default function RouteApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute />}>
          <Route exact path="/home" element={<Home />} />
        </Route>
        <Route path="/home/categories" element={<ProtectedRoute />}>
          <Route exact path="/home/categories" element={<Categories />} />
        </Route>
        <Route path="/home/customers" element={<ProtectedRoute />}>
          <Route exact path="/home/customers" element={<Customers />} />
        </Route>
        <Route path="/home/orders" element={<ProtectedRoute />}>
          <Route exact path="/home/orders" element={<Orders />} />
        </Route>
        <Route path="/home/users" element={<ProtectedRoute />}>
          <Route exact path="/home/users" element={<Users />} />
        </Route>
        <Route path="/home/my-profile" element={<ProtectedRoute />}>
          <Route exact path="/home/my-profile" element={<MyProfile/>} />
        </Route>
        <Route path="home/pro" element={<Pro/>}/>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouteApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
