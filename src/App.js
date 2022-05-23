import React from "react";
import "./index.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import "./styles.css";
import Categories from "./pages/Categories/Categories";
import Customers from "./pages/Customers/Customers";
import Orders from "./pages/Orders/Orders";
import Users from "./pages/Users/Users";
import MyProfile from "./pages/MyProfile/myProfile";
import Notfound from "./pages/NotFound/Notfound";
import Pro from "./pages/MyProfile/pro"
import ProtectedRoute from "./components/ProtectedRoute"
import UnAuthorized from "./pages/UnAuthorized/unAuthorized";

function App() {
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

        <Route path="/unauthorized-access" element={<UnAuthorized />} />
        
        <Route path="/home/my-profile" element={<ProtectedRoute />}>
          <Route exact path="/home/my-profile" element={<MyProfile/>} />
        </Route>
        <Route path="home/pro" element={<Pro/>}/>
        
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
