import axios from "axios";
import store from "../store"; // Import the store
import {
  USER_LOGIN_REQUEST,
  USER_FAIL_REQUEST,
  USER_SUCCESS_REQUEST,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_FAIL,
  USER_REGISTER_CLEAR,
  CLEAR_LOGIN_ERROR,
  USER_DETAIL_REQUEST,
  USER_DETAIL_SUCCESS,
  USER_DETAIL_FAIL,
  USER_ADDRESS_REQUEST,
  USER_ADDRESS_SUCCESS,
  USER_ADDRESS_FAIL,
  USER_ADD_ADDRESS_REQUEST,
  USER_ADD_ADDRESS_SUCCESS,
  USER_ADD_ADDRESS_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
} from "../constants/userContants";

console.log(USER_LOGIN_REQUEST, "USER_LOGIN_REQUEST");
export const login = (email, password) => async (dispatch) => {
  try {
    console.log(email, password);
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      // Add the 'await' keyword here
      "http://localhost:3001/api/v1/user/login",
      { email, password },
      config
    );
    console.log(data, "data");
    dispatch({ type: USER_SUCCESS_REQUEST, payload: data.data });

    localStorage.setItem("userInfo", JSON.stringify(data.data));
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_FAIL_REQUEST,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");

  dispatch({ type: USER_LOGOUT });
};

export const register =
  (name, email, password) => async (dispatch, getState) => {
    try {
      console.log(email, password);
      dispatch({ type: USER_REGISTER_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        // Add the 'await' keyword here
        "http://localhost:3001/api/v1/user",
        { name, email, password },
        config
      );
      console.log(data, "data");
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  };
export const getUserDeails = () => async (dispatch) => {
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
    dispatch({ type: USER_DETAIL_REQUEST });

    const { data } = await axios.get(
      // Add the 'await' keyword here
      "http://localhost:3001/api/v1/user",

      config
    );
    console.log(data, "data");
    dispatch({ type: USER_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_DETAIL_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};
export const updateUserDeails = (name) => async (dispatch) => {
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
    dispatch({ type: USER_DETAIL_REQUEST });

    const { data } = await axios.patch(
      "http://localhost:3001/api/v1/user",
      { name },
      config
    );
    console.log(data, "data");
    dispatch({ type: USER_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_DETAIL_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: USER_VERIFY_OTP_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "http://localhost:3001/api/v1/user/verify",
      { email, otp },
      config
    );
    console.log(data);
    dispatch({ type: USER_VERIFY_OTP_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: USER_VERIFY_OTP_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const clearUserRegistration = () => async (dispatch) => {
  dispatch({
    type: USER_REGISTER_CLEAR,
  });
};

export const clearLoginError = () => {
  return {
    type: CLEAR_LOGIN_ERROR,
  };
};

export const updateUserPassword = (password) => async (dispach) => {};

export const getUserAddress = () => async (dispatch) => {
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
    dispatch({ type: USER_ADDRESS_REQUEST });

    const { data } = await axios.get(
      // Add the 'await' keyword here
      "http://localhost:3001/api/v1/user/address",

      config
    );
    console.log(data, "data");
    dispatch({ type: USER_ADDRESS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_ADDRESS_FAIL,
      payload:
        error?.message && error?.response?.data?.message
          ? error.response.data.message
          : error?.message,
    });
  }
};

export const addUserAddress =
  (street, city, postalCode, country) => async (dispatch) => {
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
      dispatch({ type: USER_ADD_ADDRESS_REQUEST });
      // postalCode=Number(postalCode)
      console.log(street, city, postalCode, country);
      const { data } = await axios.post(
        // Add the 'await' keyword here
        "http://localhost:3001/api/v1/user/address",
        { street, city, postalCode, country },

        config
      );
      console.log(data, "data");
      dispatch({ type: USER_ADD_ADDRESS_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: USER_ADD_ADDRESS_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  };


  export const getUsers=()=>async (dispatch)=>{
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
      dispatch({ type: USER_LIST_REQUEST });
      const { data } = await axios.get(
        // Add the 'await' keyword here
        "http://localhost:3001/api/v1/user/all",
        config
      );
      dispatch({ type: USER_LIST_SUCCESS, payload: data.data });
    } catch (error) {
      console.log(error);
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error?.message && error?.response?.data?.message
            ? error.response.data.message
            : error?.message,
      });
    }
  }