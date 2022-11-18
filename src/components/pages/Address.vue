<style>
    .d-list, .d-list input,  .d-list datalist, .d-list option{
        width: 100%;
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
        url: process.env.VUE_APP_DADATA_URL,
        token: process.env.VUE_APP_DADATA_TOKEN,
        secret: process.env.VUE_APP_DADATA_SECRET,
      };
    },
    methods: {
      print(){
        // console.log('here')
        this.res = this.q;
      },
      async fetchData(){
        if(this.q.length > 3){
          let options = {
              method: "POST",
              // mode: "cors",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Token " + this.token,
                  "X-Secret": this.secret
            },
            body: JSON.stringify({query: this.q})
          };
          await fetch(this.url, options)
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