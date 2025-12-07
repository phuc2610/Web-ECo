import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { token, navigate } = useContext(ShopContext);

  if (!token) {
    navigate("/login");
    return null;
  }

  return children;
};

export default ProtectedRoute;
