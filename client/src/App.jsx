import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VerifyEmail from "./screens/VerifyEmail";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import ProductUpdateScreen from "./screens/ProductUpdateScreen";
import OrderListScreen from "./screens/OrderListScreen";
import SearchboxContainer from "./components/SearchboxContainer";
//UserListScreen
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Main />} />
          <Route path="product/:id" element={<ProductScreen />} />
          <Route path="order/:id" element={<OrderScreen />} />
          <Route path="login" element={<LoginScreen />} />
          <Route path="register" element={<RegisterScreen />} />
          <Route path="footer" element={<Footer />} />
          <Route path="/productlist" exact element={<ProductListScreen />} />
          <Route path="/productlist/:page" element={<ProductListScreen />} />
          <Route path="/:id?" element={<CartScreen />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/list" element={<UserListScreen />} />
          <Route path="/edit" element={<ProductEditScreen />} />
          <Route path="/update/:id" element={<ProductUpdateScreen />} />
          <Route path="/search/:keyword" exact element={<Main />} />
          <Route path="/search/:keyword/page/:page" element={<Main />} />
          <Route path="/page/:page" element={<Main />} />
          <Route path="/admin/orders" element={<OrderListScreen />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
