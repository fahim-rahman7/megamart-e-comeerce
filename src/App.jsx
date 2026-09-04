import { BrowserRouter, Route, Routes } from "react-router";

// Public Layout & Pages
import Layout from "./components/layout";
import Home from "./pages/users/Home";
import Shop from "./pages/users/Shop";
import ProductDetails from "./pages/users/ProductDetails";
import Registration from "./pages/users/Registration";
import LogIn from "./pages/users/LogIn";
import Profile from "./pages/users/Profile";
import Cart from "./pages/users/Cart";
import VerifyEmail from "./pages/users/VerifyEmail";
import Order from "./pages/users/Order";
import MyOrders from "./pages/users/MyOrders";
import NotFound from "./pages/users/NotFound";
import ForgotPassword from "./pages/users/ForgotPassword";
import ResetPassword from "./pages/users/ResetPassword";

// Admin Guard, Layout & Pages
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";

// Toast Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminUsers from "./pages/admin/adminUsers";

function App() {
  return (
    <>
      <ToastContainer position="top-right" />

      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-pass/:token" element={<ResetPassword />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected Admin Dashboard Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;