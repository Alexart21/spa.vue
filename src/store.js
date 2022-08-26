import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
  },
  getters: {
    modal: (state) => state.modal,
  },
  mutations: {
    showCallModal(state) {
      state.modal = true;
    //   console.log(state.modal);
    },
    hideCallModal(state) {
      state.modal = false;
    },
  },
  actions: {},
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
