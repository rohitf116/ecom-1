import {
  SAVE_PAYMENT_METHOD,
  SAVE_PAYMENT_ADDRESS,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
} from "../constants/orderContants";
import axios from "axios";
import store from "../store"; // Import the store
export const savePaymentAddress = (address) => (dispatch) => {
  console.log(address, "adrress");
  dispatch({
    type: SAVE_PAYMENT_ADDRESS,
    payload: address,
  });
};

export const savePaymentMethod = (method) => (dispatch) => {
  console.log(method, "method");
  dispatch({
    type: SAVE_PAYMENT_METHOD,
    payload: method,
  });
};
export const createOrder =
  (_id, paymentMethod, taxPrice, shippingPrice, shippingAddress) =>
  async (dispatch) => {
    try {
      // Access userInfo from the store's state
      const userInfo = store.getState().userLogin.userInfo;
      console.log(_id, "_id");
      // Check if userInfo exists and has a token property
      const token = userInfo && userInfo.token ? userInfo.token : "";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token for the Authorization header
        },
      };
      dispatch({ type: ORDER_CREATE_REQUEST });

      const { data } = await axios.post(
        // Add the 'await' keyword here
        "http://localhost:3001/api/v1/order",
        { _id, paymentMethod, taxPrice, shippingPrice, shippingAddress },
        config
      );
      console.log(data, "data");
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  };

export const getOrder = (id) => async (dispatch) => {
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
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(
      // Add the 'await' keyword here
      `http://localhost:3001/api/v1/order/${id}`,
      config
    );
    console.log(data, "data");
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (dispatch) => {
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
    dispatch({ type: ORDER_PAY_REQUEST });

    const { data } = await axios.put(
      // Add the 'await' keyword here
      `http://localhost:3001/api/v1/order/${orderId}/pay`,
      paymentResult,
      config
    );
    console.log("Dispatching ORDER_PAY_SUCCESS with payload: ", data.data);
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const getMyOrder = () => async (dispatch) => {
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
    dispatch({ type: ORDER_LIST_MY_REQUEST });

    const { data } = await axios.get(
      // Add the 'await' keyword here
      `http://localhost:3001/api/v1/order`,
      config
    );
    console.log(data, "data");
    dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const getOrderList = () => async (dispatch) => {
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
    dispatch({ type: ORDER_LIST_REQUEST });

    const { data } = await axios.get(
      // Add the 'await' keyword here
      `http://localhost:3001/api/v1/order/admin`,
      config
    );
    console.log(data, "data");
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};
