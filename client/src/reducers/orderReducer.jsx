import { SAVE_PAYMENT_METHOD,SAVE_PAYMENT_ADDRESS } from "../constants/orderContants";

export const shippingAddressReducer = (state = {}, action) => {
    switch (action.type) {
      case SAVE_PAYMENT_ADDRESS:
        return {
          ...state,
          shippingAddress: action.payload,
        };
      default:
        return state;
    }
  };

  export const paymentMethodReducer = (state = {}, action) => {
    switch (action.type) {
      case SAVE_PAYMENT_METHOD:
        return {
          ...state,
          paymentMethod: action.payload,
        };
      default:
        return state;
    }
  };