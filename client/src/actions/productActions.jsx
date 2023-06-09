import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_LIST_REVIEW_REQUEST,
  PRODUCT_LIST_REVIEW_SUCCESS,
  PRODUCT_LIST_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from "../constants/productContants";
import { BASE_URL } from "../config";
import store from "../store"; // Import the store
import axios from "axios";
console.log(BASE_URL, "base");
const myUrl = `${BASE_URL}/api/v1/product`;
console.log(myUrl, "myUrl");
export const listProducts =
  (keyword = "", page = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/product?keyword=${keyword}&page=${page}`
      );
      console.log(data, "mist");
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.message && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const topProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST });
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/top`);
    dispatch({ type: PRODUCT_TOP_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.message && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDeatils = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });
    console.log(id);
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/${id}`);
    console.log(data);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.message && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    const userInfo = store.getState().userLogin.userInfo;

    // Check if userInfo exists and has a token property
    const token = userInfo && userInfo.token ? userInfo.token : "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the token for the Authorization header
      },
    };
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const { data } = await axios.delete(
      // Add the 'await' keyword here
      `${BASE_URL}/api/v1/product/admin/${id}`,
      config
    );
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const productCreate =
  (name, description, brand, category, price, countInStock, file) =>
  async (dispatch) => {
    try {
      const userInfo = store.getState().userLogin.userInfo;

      // Check if userInfo exists and has a token property
      const token = userInfo && userInfo.token ? userInfo.token : "";

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use the token for the Authorization header
        },
      };
      dispatch({ type: PRODUCT_CREATE_REQUEST });
      const { data } = await axios.post(
        // Add the 'await' keyword here
        `${BASE_URL}/api/v1/product`,
        { name, description, brand, category, price, countInStock, file },
        config
      );
      console.log(data);
      dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: PRODUCT_CREATE_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  };
export const updateProduct =
  (name, description, brand, category, price, countInStock, file, id) =>
  async (dispatch) => {
    try {
      console.log(brand);
      const userInfo = store.getState().userLogin.userInfo;

      // Check if userInfo exists and has a token property
      const token = userInfo && userInfo.token ? userInfo.token : "";

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use the token for the Authorization header
        },
      };
      dispatch({ type: PRODUCT_UPDATE_REQUEST });
      const { data } = await axios.put(
        // Add the 'await' keyword here
        `${BASE_URL}/api/v1/product/${id}`,
        { name, description, brand, category, price, countInStock, file },
        config
      );
      console.log(data);
      dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  };

export const createReview = (rating, comment, id) => async (dispatch) => {
  try {
    const userInfo = store.getState().userLogin.userInfo;

    // Check if userInfo exists and has a token property
    const token = userInfo && userInfo.token ? userInfo.token : "";

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Use the token for the Authorization header
      },
    };
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });
    await axios.post(
      // Add the 'await' keyword here
      `${BASE_URL}/api/v1/reviews/${id}`,
      { rating, comment },
      config
    );

    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const getReviews = (id) => async (dispatch) => {
  try {
    const userInfo = store.getState().userLogin.userInfo;

    // Check if userInfo exists and has a token property
    const token = userInfo && userInfo.token ? userInfo.token : "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the token for the Authorization header
      },
    };
    dispatch({ type: PRODUCT_LIST_REVIEW_REQUEST });
    const { data } = await axios.get(
      // Add the 'await' keyword here
      `${BASE_URL}/api/v1/reviews/product/${id}`,

      config
    );

    dispatch({ type: PRODUCT_LIST_REVIEW_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_LIST_REVIEW_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};
