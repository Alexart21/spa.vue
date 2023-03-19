import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
    countrys: [],
    regions: [],
    citys: [],
    isGuest: true,
    username: "",
    userEmail: "",
    userRole: "",
    userStatus: "",
    avatarPath: "",
    csrf: "",
    token: "",
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
    csrf: (state) => state.csrf,
    token: (state) => state.token,
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
    clearRegions(state) {
      state.regions = [];
    },
    clearCitys(state) {
      state.citys = [];
    },
    setCsrf(state, csrf) {
      state.csrf = document.getElementById("_csrf_token").content;
    },
    setUser(state, response) {
      if (response.isGuest) {
        state.isGuest = true;
      } else {
        state.isGuest = false;
        state.username = response.username;
        state.userEmail = response.email;
        state.userRole = response.role;
        state.userStatus = response.status;
        state.avatarPath = response.avatarPath;
        state.token = response.token;
        localStorage.setItem('token', response.token)
      }
    },
  },
  actions: {
    // данные пользователя если авторизован
    async loadUser(context) {
      let url = "/user";
      let formData = new FormData();
      formData.append("_token", context.state.csrf);
      let response = await fetch(url, {
        method: "post",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      response = await response.json();
      context.commit('setUser', response);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
