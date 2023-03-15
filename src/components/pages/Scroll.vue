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
// import { mapActions, mapGetters } from "vuex";
import { mapGetters} from "vuex";
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
      csrf: '',
      token: '',
    };
  },
  methods: {
    async loadData() {
      this.errText = '';
      if (!this.stop) {
        this.loader = true;
        this.stop = true; // запираем а то скрол дергается и несколько запросов летит
        // чтобы не оправлять следующий запрос не обработав предидущий
        let url = "/api/auth/countrys";
        let body = {
          offset: this.offset,
          limit: this.limit,
        };
        let response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json",
            "Authorization" : "Bearer " + this.token
          },
          body: JSON.stringify(body),
        });
        if (response.redirected || response.status == 403) {
          this.loader = false;
          this.errText = "Требуется авторизация!";
        }
        if (!response.ok) {
          console.log(response);
          this.loader = false;
          this.errText = `Ошибка ${response.status} ${response.statusText}`;
        } else {
          // 200
          let result = await response.json();
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
        }
        this.loader = false;
      } else {
        console.log("total=" + this.list.length);
      }
    },
    async getToken(){
      let url = '/token';
      let formData = new FormData();
      formData.append("_token", this.csrf);
      await fetch(url, {
          method: 'post',
          headers: {
            "Accept": "application/json",
          },
          body: formData
      })
      .then(response => response.json())
      .then(result => {
        console.log('here')
        console.log(result)
        if(result.token){
          this.token = result.token;
          this.stop = false;
          console.log('csrf=' + this.csrf);
          this.loadData();
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
    
  },
  mounted() {
    this.csrf = document.getElementById('_csrf_token').content;
    this.getToken();
  },

  computed: {
    ...mapGetters(["csrf"]),
  },
  
};
</script>
