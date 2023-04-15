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
    refreshTokenModal: false,
    refreshed: false,
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
    showRefreshTokenModal(state) {
      state.refreshTokenModal = true;
    },
    hideRefreshTokenModal(state) {
      state.refreshTokenModal = false;
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
        localStorage.setItem("token", response.token);
      }
    },
    setToken(state, response){
      state.token = response.access_token;
      localStorage.setItem("token", response.access_token);
    }
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
      context.commit("setUser", response);
    },
    async refreshToken(context) {
      let url = "/api/auth/refresh";
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + context.state.token,
        },
      });
      if (response.ok) {
        response = await response.json();
        context.commit("setToken", response);
      } else {
        console.log("Ошибка в action refreshToken");
        console.log(response);
      }
    },
    beep(){
      let snd = new Audio("data:audio/x-wav;base64, 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");
      let promise = snd.play();
      promise.then(_ => {
        console.log('play!');
      }).catch(err => {
        console.log(err.message);
      });
    }
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
