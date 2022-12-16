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
  <div id="scroll-container">
    <h1 v-for="item in list" :key="item.country_id">{{ item.name }}</h1>
    <!-- <infinite-loading target="#scroll-container" @infinite="load"></infinite-loading> -->
    <div v-if="loader" class="loader">Зaгружаю...</div>
    <InfiniteLoading target="#scroll-container" @infinite="loadData" />
  </div>
</template>
<script>
import InfiniteLoading from "v3-infinite-loading";
export default {
  data() {
    return {
      offset: 0,
      step: 10,
      loader: false,
      stop: false,
      list: [],
    };
  },
  methods: {
    async loadData() {
      if (!this.stop) {
        this.loader = true;
        this.stop = true; // запираем а то скрол дергается и несколько запросов летит
        // чтобы не оправлять следующий запрос не обработав предидущий
        let url = "/inf?offset=" + this.offset + "&step=" + this.step;
        let options = {
          mode: "no-cors",
        };
        await fetch(url, options)
          .then((response) => response.json())
          .then((result) => {
            if (result.success && result.data) {
              this.stop = false;
              let total = result.total;
              let data = result.data;
              console.log(data);
              this.list.push(...data);
              console.log("current list count = " + this.list.length);
              // смотрим все ли данные выбрали с сервера
              // result.total - столько записей всего в базе
              if (this.list.length >= total || total < this.step) {
                this.stop = true;
              }
              this.offset += this.step;
              console.log("next offs = " + this.offset);
            }
          })
          .catch((error) => console.log("error", error));
        this.loader = false;
      } else {
        console.log("total=" + this.list.length);
      }
    },
  },
  mounted() {
    // this.loadData()
  },
  components: {
    InfiniteLoading,
  },
};
</script>
