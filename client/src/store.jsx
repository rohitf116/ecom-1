import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  loginReducer,
  userRegisterReducer,
  userVerifyOtpReducer,
  userDetailReducer,
  userAddressReducer,
  userAddAddressReducer,
} from "./reducers/userReducers";
import {
  shippingAddressReducer,
  paymentMethodReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
} from "./reducers/orderReducer";
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailReducer,
  cart: cartReducer,
  userLogin: loginReducer,
  userRegister: userRegisterReducer,
  userVerifyOtp: userVerifyOtpReducer,
  userDetail: userDetailReducer,
  userAddress: userAddressReducer,
  userAddAddress: userAddAddressReducer,
  shippingAddress: shippingAddressReducer,
  paymentMethod: paymentMethodReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
});
const cartFormLocalStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {};
const userFormLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
const initalState = {
  cart: cartFormLocalStorage,
  userLogin: { userInfo: userFormLocalStorage },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
