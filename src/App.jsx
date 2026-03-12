import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Registration from "./pages/Registration";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";

function App() {
  return (
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
