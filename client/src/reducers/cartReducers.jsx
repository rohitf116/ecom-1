import {
  CART_ADD_ITEM,
  CLEAR_CART,
  CART_REMOVE_ITEM,
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAIL,
} from "../constants/cartContants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      return action.payload;

    case CART_REMOVE_ITEM:
      return { cart: action.payload };
    case CART_FETCH_REQUEST:
      return { loading: true };
    case CART_FETCH_SUCCESS:
      return {
        loading: false,
        cart: action.payload,
      };
    case CART_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_CART:
      return { cart: { items: [] } };
    default:
      return state;
  }
};
