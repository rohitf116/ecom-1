import {
    SAVE_PAYMENT_METHOD,SAVE_PAYMENT_ADDRESS
  } from "../constants/orderContants";

  export const savePaymentAddress = (address) => (dispatch) => {
    console.log(address,"adrress")
    dispatch({
      type: SAVE_PAYMENT_ADDRESS,
      payload: address,
    });
  };

  export const savePaymentMethod = (method) => (dispatch) => {
    console.log(method,"method")
    dispatch({
      type: SAVE_PAYMENT_METHOD,
      payload: method,
    });
  };