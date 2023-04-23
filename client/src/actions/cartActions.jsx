import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_ADD_ITEM_FAIL,
  CLEAR_CART,
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAIL,
} from "../constants/cartContants";

import store from "../store"; // Import the store
export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    // Access userInfo from the store's state
    const userInfo = store.getState().userLogin.userInfo;

    // Check if userInfo exists and has a token property
    const token = userInfo && userInfo.token ? userInfo.token : "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the token for the Authorization header
      },
    };
    const { data } = await axios.post(
      "http://localhost:3001/api/v1/cart",
      {
        id,
        qty,
      },
      config
    );
    console.log(data, "--------------");
    dispatch({
      type: CART_ADD_ITEM,
      payload: data.data,
    });
    localStorage.setItem("cart", JSON.stringify(getState()));
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const removeFromCart = (id, qty) => async (dispatch, getState) => {
  console.log(id, qty);
  const userInfo = store.getState().userLogin.userInfo;

  // Check if userInfo exists and has a token property
  const token = userInfo && userInfo.token ? userInfo.token : "";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Use the token for the Authorization header
    },
  };
  const { data } = await axios.put(
    "http://localhost:3001/api/v1/cart",
    {
      id,
      qty,
    },
    config
  );
  console.log(data);
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: data.data,
  });
  localStorage.setItem("cart", JSON.stringify(getState()));
};
export const clearCart = () => (dispatch) => {
  dispatch({ type: CLEAR_CART });
};

export const fetchCart = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_FETCH_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const token = userInfo && userInfo.token ? userInfo.token : "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:3001/api/v1/cart",
      config
    );
    dispatch({
      type: CART_FETCH_SUCCESS,
      payload: data.data,
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart));
  } catch (error) {
    dispatch({
      type: CART_FETCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
