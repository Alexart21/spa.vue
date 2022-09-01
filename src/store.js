import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
    countrys: [],
    regions: [],
    citys: [],
    isGuest: true,
    username: '',
    userEmail: '',
    userRole: '',
    userStatus: '',
    avatarPath: '',
  },
  getters: {
    modal: (state) => state.modal,
    countrys: (state) => state.countrys,
    regions: (state) => state.regions,
    citys: (state) => state.citys,
    isGuest: (state) => state.isGuest,
    username: (state) => state.username,
    userEmail: (state) => state.userEmail,
    userRole: (state) => state.userRole,
    userStatus: (state) => state.userStatus,
    avatarPath: (state) => state.avatarPath,
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
    },
    // setGuest(state) {
    //   state.isGuest = true;
    // },
    setUser(state, response) {
      if(response.isGuest){
        state.isGuest = true;
      }else{
        state.isGuest = false;
        state.username = response.username;
        state.userEmail = response.email;
        state.userRole = response.role;
        state.userStatus = response.status;
        state.avatarPath = response.avatarPath;
      }
    },
  },
  actions: {
    // данные пользователя если авторизован
    async loadUser({ commit }){
      let url = "/user";
      let response = await fetch(url);
      response = await response.json();
      commit("setUser", response);
    },
    // список стран
    async loadCountrys({ commit }) {
      let url = "/country";
      let response = await fetch(url);
      response = await response.json();
      commit("setCountrys", response);
    },
    // регионы для выбранной страны
    async loadRegions({ commit }, code) {
      let url = "/region?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      commit("setRegions", response);
    },
    // города для выбранного региона
    async loadCitys({ commit }, code) {
      let url = "/city?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      commit("setCitys", response);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
