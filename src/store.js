import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
    countrys: [],
    regions: [],
    citys: [],
  },
  getters: {
    modal: (state) => state.modal,
    countrys: (state) => state.countrys,
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
    setCountrys(state, response) {
      state.countrys = response.data;
    },
    setRegions(state, response) {
      state.regions = response.data;
    },
    setCitys(state, response) {
      state.citys = response.data;
    },
    clearRegions(state){
      state.regions = [];
    },
    clearCitys(state){
      state.citys = [];
    }
  },
  actions: {
    async loadCountrys(context, code) {
      let url = "/country";
      let response = await fetch(url);
      response = await response.json();
      context.commit("setCountrys", response);
    },
    async loadRegions(context, code) {
      let url = "/region?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      context.commit("setRegions", response);
    },
    async loadCitys(context, code) {
      let url = "/city?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      context.commit("setCitys", response);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
