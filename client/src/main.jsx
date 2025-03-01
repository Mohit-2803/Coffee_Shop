import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Layout from "./layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import SellerPage from "./pages/SellerPage";
import SellerRegisterPage from "./pages/SellerRegisterPage";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./components/SellerDashboard/AddProduct";
import SellerProductsPage from "./components/SellerDashboard/SellerProductsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductInfoPage from "./pages/ProductInfoPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./contexts/CartProvider";
import DealsPage from "./pages/DealsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import TermsPage from "./pages/TermsPage";
import SellerOrders from "./components/SellerDashboard/SellerOrders";
import FeaturedPage from "./pages/FeaturedPage";
import AnalyticsPage from "./components/SellerDashboard/AnalyticsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/featured" element={<FeaturedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductInfoPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sell" element={<SellerPage />} />
        <Route path="/sell/register" element={<SellerRegisterPage />} />
        <Route path="/sell/dashboard" element={<SellerDashboard />} />
        <Route path="/sell/dashboard/add-product" element={<AddProduct />} />
        <Route path="/sell/dashboard/orders" element={<SellerOrders />} />
        <Route path="/sell/dashboard/analytics" element={<AnalyticsPage />} />
        <Route
          path="/sell/dashboard/products"
          element={<SellerProductsPage />}
        />
      </Route>

      {/* Default Route */}
      <Route index element={<HomePage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
