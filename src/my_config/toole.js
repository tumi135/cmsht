import store from "../store/index";

export const checkLogin = function() {
  {
    if (store.state.login) {
      return true;
    } else {
      return false;
    }
  }
};
