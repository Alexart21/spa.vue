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
  <h3 class="text-danger" v-if="errText">{{ errText }}</h3>
  <div id="scroll-container">
    <h1 v-for="item in list" :key="item.country_id">{{ item.name }}</h1>
    <!-- <infinite-loading target="#scroll-container" @infinite="load"></infinite-loading> -->
    <div v-if="loader" class="loader">Зaгружаю...</div>
    <InfiniteLoading target="#scroll-container" @infinite="loadData" />
  </div>
</template>
<script>
import InfiniteLoading from "v3-infinite-loading";
// import { mapActions } from "vuex";
import { mapGetters } from "vuex";
// import { mdiLeak } from "@mdi/js";
export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      offset: 0,
      limit: 10,
      loader: false,
      stop: true,
      list: [],
      csrf: "",
      errText: "",
    };
  },
  methods: {
    errorHandler(code, statusText) {
      let text;
      if (code == 401) {
        text = `${code} Недействительный токен авторизации. Не выполнен вход или истек срок токена`;
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
      this.errText = "";
      if (!this.stop) {
        this.loader = true;
        this.stop = true; // запираем а то скрол дергается и несколько запросов летит
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
              // console.log(data);
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
    warn(){
      if(!this.token){
        this.errText = 'Необходима авторизация!';
      }
    }
  },
  mounted() {
    setTimeout(this.warn, 4000);
  },
  computed: {
    ...mapGetters(["token"]),
  },
  watch: {
    token: {
      handler() {
        // как получим токен только тогда запускаем загрузку данных
        if(this.token){
          // console.log('token=' + this.token)
          this.start();
        }
      },
    },
  },
};
</script>
