import React from "react";
import { ReactDOM } from "react";
import { Navigate,Outlet } from "react-router-dom";
const ProtectedRoute = () => {
let auth = false;
if(localStorage.getItem("isAuthenticated")){
auth =true;
}
return auth ? <Outlet/> : <Navigate to="/" />
}
export default ProtectedRoute;