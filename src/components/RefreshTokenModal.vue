<template>
  <div v-if="refreshTokenModal">
    <div><button @click="refreshToken" class="btn btn-success">Обновить токен</button></div>
  <h3 v-if="tokenChanged" class="text-succes">Токен обновлен</h3>
  </div>
</template> 
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
        tokenChanged: false,
    }
  },
  methods: {
    ...mapActions(["refreshToken"]),
    ...mapMutations(["hideRefreshTokenModal"]),
    hide(){
        this.hideRefreshTokenModal();
    }
  },
  computed: {
    ...mapState(["token", "refreshTokenModal"]),
  },
  mounted(){
  },
  watch: {
    token: {
      handler() {
          if(this.token){
            this.tokenChanged = true;
            setTimeout(this.hide, 3000);
          }
      },
    },
  },
};
</script>
