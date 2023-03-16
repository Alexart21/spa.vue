<template>
  <logoutdialog />
  <footer class="innerShadow gradient3">
    <strong class="company">Alex-art21</strong><sup>&copy;</sup> web developer
    group 2009&mdash;2022 тел. <b class="corpid">+7(987) 668-04-84</b><br />
    <strong>Создание и продвижение сайтов в Чебоксарах</strong><br />
    <span
      >Ваши персональные данные могут обрабатывается только в соответствии с
      <a href="/politic" style="position: relative; z-index: 100"
        >ФЗ «О персональных данных» № 152-ФЗ</a
      ></span
    >
    <br /><small style="position: relative; z-index: 100"
      >Этот сайт защищен Google reCAPTCHA в соответствии с
      <a href="https://policies.google.com/privacy"
        >политикой конфиденциальности</a
      >
      и <a href="https://policies.google.com/terms">условиями применения</a>.
    </small>
    <br />
    <div v-if="isGuest" class="d-flex justify-content-center user-block">
      <div>
        <div class="no-avatar"></div>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div><a class="text-dark" href="/login">вход</a></div>
      &nbsp;&nbsp;
      <div><a class="text-dark" href="/register">регистрация</a></div>
    </div>
    <div
      v-else-if="userStatus == 10"
      class="d-flex justify-content-center user-block"
    >
      <div>
        <a href="/user/profile" title="личный кабинет"
          ><img
            :src="avatarPath"
            alt=""
            class="avatar rounded-circle img-thumbnail"
        /></a>
      </div>
      &nbsp;&nbsp;
      <div class="username">
        <a href="/user/profile" title="личный кабинет" class="text-dark">{{
          username
        }}</a>
      </div>
      <div>
        &nbsp;&nbsp;
        <form id="logout-form" name="logout" @submit.prevent="logout" action="/logout" method="post" style="display: inline">
          <input type="hidden" name="_token" ref="csrf_input" value="csrf">
          <button id="logout-btn" type="submit" title="выход" style="display: inline;background: transparent"><mdicon name="logout" width="30" height="30" style="line-height: 40px; color:#555" /></button>
        </form>
      </div>
    </div>
  </footer>
</template>
<script>
import Logoutdialog from "@/components/ui/Logoutdialog";
import { mapGetters } from "vuex";
export default {
  components: {
    Logoutdialog,
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      let logoutDialog = document.getElementById("logoutDialog");
      if (logoutDialog) {
        let logoutBtn = document.getElementById("logout-btn");
        let confirmBtn = logoutDialog.querySelector("#confirmBtn");
        let logoutForm = document.getElementById("logout-form");
        if (typeof logoutDialog.showModal !== "function") {
          logoutDialog.hidden = true;
        }
          if (typeof logoutDialog.showModal === "function") {
            logoutDialog.showModal();
          } else {
            console.log(
              "Sorry, the <dialog> API is not supported by this browser"
            );
            return;
          }
          confirmBtn.addEventListener("click", () => {
            console.log("exit");
            let csrf_input = this.$refs.csrf_input;
            csrf_input.value = this.csrf;
            logoutForm.submit();
          });
          logoutDialog.addEventListener("close", () => {
            console.log("отмена");
            logoutForm.onsubmit = (e) => {
              e.preventDefault = true;
            };
          });
      }
    },
  },
  computed: {
    ...mapGetters(["isGuest", "username", "userStatus", "avatarPath", "csrf"]),
  },
  mounted() {
    // loadUser вызывается в main.js
    //  this.loadUser();
  },
};
// подтверждение выхода
// let logoutDialog = document.getElementById('logoutDialog');
// if(logoutDialog){
//     let logoutBtn = document.getElementById('logout-btn');
//     let confirmBtn = logoutDialog.querySelector('#confirmBtn');
//     let logoutForm = document.getElementById('logout-form');
//     if (typeof logoutDialog.showModal !== 'function') {
//         logoutDialog.hidden = true;
//     }
//     logoutBtn.addEventListener('click', () => {
//       alert('here');
//         if (typeof logoutDialog.showModal === "function") {
//             logoutDialog.showModal();
//         } else {
//             console.log('Sorry, the <dialog> API is not supported by this browser');
//             // logoutForm.submit();
//             return;
//         }
//         //
//         logoutForm.onsubmit = (e) => {
//             e.preventDefault();
//         }
//         confirmBtn.addEventListener('click', () => {
//             console.log('exit');
//             logoutForm.submit();
//         });
//         logoutDialog.addEventListener('close', () => {
//         console.log('отмена');
//             logoutForm.onsubmit = (e) => {
//                 e.preventDefault = true;
//             }
//         });
//     });
// }
</script>
