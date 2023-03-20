<style>
#scroll-container {
  height: 200px;
  overflow-y: scroll;
  border: 1px solid #000;
  padding: 20px;
}
.loader {
  width: 100%;
  text-align: center;
  height: 60px;
  font-size: 200%;
  line-height: 60px;
}
</style>
<template>
  <h1>Infinite scroll test</h1>
  <RefreshTokenModal />
  <!-- <h3 v-if="successText" class="text-success">{{ successText }}</h3> -->
  <h3 v-if="errText" class="text-danger">{{ errText }}</h3>
  <div id="scroll-container">
    <h1 v-for="item in list" :key="item.country_id">{{ item.name }}</h1>
    <!-- <infinite-loading target="#scroll-container" @infinite="load"></infinite-loading> -->
    <div v-if="loader" class="loader">Зaгружаю...</div>
    <InfiniteLoading target="#scroll-container" @infinite="loadData" />
  </div>
</template>
<script>
import InfiniteLoading from "v3-infinite-loading";
import { mapGetters, mapMutations, mapActions } from "vuex";
import RefreshTokenModal from "@/components/RefreshTokenModal.vue";
// import { mdiLeak } from "@mdi/js";
export default {
  components: {
    InfiniteLoading,
    RefreshTokenModal
  },
  data() {
    return {
      offset: 0,
      limit: 10,
      loader: false,
      stop: true,
      list: [],
      csrf: "",
      // token: "",
      // successText: "",
      errText: "",
    };
  },
  methods: {
    ...mapMutations(['showRefreshTokenModal', 'hideRefreshTokenModal']),
    errorHandler(code, statusText) {
      let text;
      if (code == 401) {
        if(this.isGuest){
          text = `${code} Требуется авторизации`;
        }else{
          text = `${code} Истек срок действия токена`;
          this.showRefreshTokenModal();
        }
      } else if (code == 403) {
        text = `${code} Требуется авторизации`;
      } else if (code == 404) {
        text = `${code} Not Found`;
      } else {
        text = `Ошибка ${code} ${statusText}`;
      }
      return text;
    },
    async loadData() {
      // this.successText = "";
      this.errText = "";
      this.hideRefreshTokenModal();
      if (!this.stop) {
        this.loader = true;
        // this.stop = true; // запираем а то скрол дергается и несколько запросов летит
        // чтобы не оправлять следующий запрос не обработав предидущий
        let url = "/api/auth/countrys";
        let body = {
          offset: this.offset,
          limit: this.limit,
        };
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Accept: "application/json",
            Authorization: "Bearer " + this.token,
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              let errMsg = this.errorHandler(
                response.status,
                response.statusText
              );
              throw new Error(errMsg);
            }
          })
          .then((result) => {
            if (result.success && result.data) {
              this.stop = false;
              let total = result.total;
              let data = result.data;
              this.list.push(...data);
              // смотрим все ли данные выбрали с сервера
              // result.total - столько записей всего в базе
              if (this.list.length >= total || total < this.limit) {
                this.stop = true;
              }
              this.offset += this.limit;
              // console.log("next offs = " + this.offset);
            }
          })
          .catch((error) => {
            this.errText = error.message;
            this.stop = true;
          });
        this.loader = false;
      } else {
        console.log("total=" + this.list.length);
      }
    },
    start() {
      this.stop = false;
      this.loadData();
    },
    checkToken(){
      // this.token = localStorage.getItem('token')
      if(!this.token){
        this.errText = 'Необходима авторизация!';
      }else{
        this.start();
      }
    }
  },
  mounted() {
    setTimeout(this.checkToken, 1000);
  },
  computed: {
    ...mapGetters(["token", "isGuest"]),
  },
  watch: {
    token: { // асинхронно подгрузился токен
      handler() {
          console.log('token_changed=' + this.token)
          if(!this.list.length){ // список еще пуст(в начале) -- запускаем загрузку данных
            this.start();
          }
          this.stop = false;
          this.errText = '';
      },
    },
  },
};
</script>
