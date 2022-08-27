import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
    regions: [],
    citys: [],
  },
  getters: {
    modal: (state) => state.modal,
    regions: (state) => state.regions,
    citys: (state) => state.citys,
  },
  mutations: {
    showCallModal(state) {
      state.modal = true;
    },
    hideCallModal(state) {
      state.modal = false;
    },
    setCitys(state, response) {
      state.citys = response.data;
    },
    setRegions(state, response) {
      state.regions = response.data;
    },
  },
  actions: {
    async loadCitys(context, code) {
      let url = "/city?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      context.commit("setCitys", response);
    },
    async loadRegions(context, code) {
      let url = "/region?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      context.commit("setRegions", response);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
