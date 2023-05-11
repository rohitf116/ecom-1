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
  USER_DETAIL_CLEAR,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_ADDRESS_REQUEST,
  USER_ADDRESS_SUCCESS,
  USER_ADDRESS_FAIL,
  USER_ADD_ADDRESS_REQUEST,
  USER_ADD_ADDRESS_FAIL,
  USER_ADD_ADDRESS_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
} from "../constants/userContants";

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_SUCCESS_REQUEST:
      return { loading: false, userInfo: action.payload };
    case USER_FAIL_REQUEST:
      return { loading: false, error: action.payload };
    case CLEAR_LOGIN_ERROR:
      return {
        ...state,
        error: null,
      };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_REGISTER_CLEAR:
      return {};
    default:
      return state;
  }
};

export const userVerifyOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_VERIFY_OTP_REQUEST:
      return { loading: true };
    case USER_VERIFY_OTP_SUCCESS:
      return { loading: false, verificationResult: action.payload };
    case USER_VERIFY_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDetailReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAIL_REQUEST:
      return { ...state, loading: true };
    case USER_DETAIL_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAIL_CLEAR:
      return {};
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userAddressReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ADDRESS_REQUEST:
      return { loading: true, address: [] };
    case USER_ADDRESS_SUCCESS:
      return { loading: false, address: action.payload };
    case USER_ADDRESS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userAddAddressReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ADD_ADDRESS_REQUEST:
      return { loading: true, currentAddress: {} };
    case USER_ADD_ADDRESS_SUCCESS:
      return { loading: false, currentAddress: action.payload };
    case USER_ADD_ADDRESS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true, users: [] };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case USER_LIST_RESET:
      return { loading: false, users: [] };
    //USER_LIST_CLEAR
    default:
      return state;
  }
};
export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true, users: [] };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
