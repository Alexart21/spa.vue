<template>
  <footer class="innerShadow gradient3">
    <strong class="company">Alex-art21</strong><sup>&copy;</sup> web developer group 2009&mdash;2022 тел. <b
      class="corpid">+7(987) 668-04-84</b><br/>
    <strong>Создание и продвижение сайтов в Чебоксарах</strong><br/>
    <span>Ваши персональные данные могут обрабатывается только в соответствии с
                        <a href="/politic"
                           style="position: relative;z-index: 100">ФЗ «О персональных данных» № 152-ФЗ</a></span>
    <br><small style="position: relative;z-index: 100">Этот сайт защищен Google reCAPTCHA в соответствии с
    <a href="https://policies.google.com/privacy">политикой конфиденциальности</a> и
    <a href="https://policies.google.com/terms">условиями применения</a>.
  </small>
    <br>
    <div v-if="isGuest" class="d-flex justify-content-center user-block">
      <div>
        <div class="no-avatar"></div>
      </div>&nbsp;&nbsp;&nbsp;
      <div><a class="text-dark" href="/login">вход</a></div>&nbsp;&nbsp;
      <div><a class="text-dark" href="/register">регистрация</a></div>
    </div>
    <div v-else-if="userStatus == 10" class="d-flex justify-content-center user-block">
      <div><a href="/user/profile" title="личный кабинет"><img :src="avatarPath" alt="" class="avatar rounded-circle img-thumbnail"></a></div>
      &nbsp;&nbsp;<div class="username"><a href="/user/profile" title="личный кабинет" class="text-dark">{{ username }}</a></div>
      <div>&nbsp;&nbsp;
        <!-- <a href="/user/logout" data-method="post"><span title="выйти">выход</span></a> -->
        <form name="logout" @submit.prevent="logout" action="/logout" method="post" style="display: inline">
          <input type="hidden" name="_token" ref="csrf_input" value="csrf">
          <button type="submit" title="выход" style="display: inline;background: transparent;transform: rotateZ(45deg)"><mdicon name="logout" width="30" height="30" style="line-height: 40px; color:#555" /></button>
        </form>
        </div>
    </div>
    <router-link :to="{name: 'location'}" >Select location
              </router-link>
  </footer>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
    };
  },
  methods: {
    // кнопка "выйти" должна быть методом POST и с ткеном
    logout(){
      let csrf_input = this.$refs.csrf_input;
      csrf_input.value =  this.csrf;
      let form = document.forms.logout;
      form.submit();
    }
  },
  computed: {
    ...mapGetters(["isGuest", "username", "userStatus", "avatarPath", "csrf"]),
  },
  mounted() {
   // loadUser вызывается в main.js 
  //  this.loadUser();
  },
}
</script>