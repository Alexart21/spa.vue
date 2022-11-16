<style>
    .d-list, .d-list input,  .d-list datalist, .d-list option{
        width: 500px;
        min-width: 400px;
    }
    .d-list input, .d-list input:focus{
        /*border: none;*/
        outline: none;
        padding: .7em;
        font-size: 120%;
        border: 1px solid #e1a20e;
        border-radius: 5px;
    }
</style>
<template>
    <h3>Введите адрес</h3>
<h1 ref="res">{{ res }}</h1>
<div class="d-list">
    <form action="" id="addr-form">
        <input name="q" list="addr" id="addr-inp" v-model="q" @input="fetchData" @change="print">
        <datalist id="addr">
            <option v-for="(item, index) in opt" :key="index" :value="item.value"></option>
        </datalist>
    </form>
</div> 
</template>
  <script>
  export default {
    data() {
      return {
        res: '',
        q: '',
        opt: [],
      };
    },
    methods: {
      print(){
        // console.log('here')
        this.res = this.q;
      },
      async fetchData(){
        if(this.q.length > 3){
          // console.log(this.q)
          let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
          let token = "570d95978c2db5381256783439e3ea14984c7e2b";
          let secret = "23138042db05223b5c7dd18d8c2d222c61c9d398";
          let query = this.q;
          // query = "москва хабар";
          // console.log(query);
          // return;
          let options = {
              method: "POST",
              // mode: "cors",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Token " + token,
                  "X-Secret": secret
            },
            body: JSON.stringify({query: query})
          };
          await fetch(url, options)
          .then(response => response.json())
          .then(result => {
            console.log(result.suggestions);
            this.opt = result.suggestions;
          })
          .catch(error => console.log("error", error));
        }
        
      },
    }
  }
  </script>