import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Registration from "./pages/Registration";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import VerifyEmail from "./pages/VerifyEmail";
import Order from "./pages/Order";

// 1. Import ToastContainer and the CSS file
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ⚠️ ADD THIS CSS IMPORT
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    // 2. Wrap everything in a Fragment <> so you can return two things
    <>
      {/* 3. Place the ToastContainer here so it is available everywhere */}
      <ToastContainer position="top-right" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/shop" element={<Shop/>}/>
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/shop/:id" element={<ProductDetails/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/verify-email" element={<VerifyEmail/>}/>
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-pass/:token" element={<ResetPassword />} />
            <Route path="/order" element={<Order/>}/>
            <Route path="/orders" element={<MyOrders/>}/>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;