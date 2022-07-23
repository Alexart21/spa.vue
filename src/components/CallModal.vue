<style scoped>
.modal{
  display: block;
   background: rgba(0,0,0,.2);
}
</style>
<template>
<div v-show="modal" class="modal" id="callback">
  <div class="modal-dialog">
    <div class="modal-content animate__animated animate__bounceInDown">
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Обратный звонок</h4>
        <button  @click="this.$store.commit('hideCallModal')" type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <!-- Modal body -->
<div class="modal-body">
<form name="callForm" @submit.prevent="sendForm" action="/call" method="post">

<div class="form-group">
<input type="text" class="form-control" name="callForm[name]" required placeholder="Ваше имя" aria-required="true">
<div class="help-block"></div>
</div>

<div class="form-group">
<label class="control-label" for="callform-tel">Номер телефона</label>
<input v-phone placeholder="+7(___) ___-__-__" type="text" class="form-control" name="callForm[tel]" required>
</div>
        
<div class="form-group">
<button type="submit" class="btn success-button button-anim">жду звонка!</button>
<h3 v-if="statusText" class="status" :class="[isOk ? 'text-success' : 'text-danger']">{{ statusText }}</h3>
</div>
</form>
</div>
</div>
  </div>
</div>
</template>
<script>
function readCookie(name) {
  const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
//
import { mapGetters } from 'vuex';
export default {
  computed: mapGetters(['modal']),
  directives: {
    // маска ввода +7 (999) 999-99-99
    phone: {
      mounted(el) {
      el.oninput = function(e) {
        if (!e.isTrusted) {
          return
        }
        const x = this.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)
        x[1] = '+7'; 
        this.value = !x[3] ? x[1] + ' (' + x[2] : x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '')
        
      }
    }
    },
  },
  data(){
      return {
        statusText: '',
        isOk: true,
        // csrfToken: readCookie('csrf_token'),
      }
    },
  methods: {
    hideStatus(){
        this.statusText = '';
    },
    clearForm(){
      document.forms.callForm.reset();
      this.hideStatus();
    },
    async sendForm(){
      let formData = new FormData(document.forms.callForm);
      formData.append(readCookie('csrf_param'), readCookie('csrf_token'));
      this.isOk = true,
      this.statusText = 'Отправка...';
      const url = '/call';
         let response = await fetch(url, {
             method: 'POST',
             body: formData,
             headers: {
               // значение этого заголовка обычно ставится автоматически,
               // в зависимости от тела запроса
            },
         });
         let result = await response.text(); // приходит 0 или 1(true/false)
         if(response.ok){
            if(result){
              this.statusText = 'Спасибо, данные приняты. Мы с Вами свяжемся';
              setTimeout(this.clearForm, 12000);
            }else{
              this.isOk = false;
              this.statusText = 'Ошибка! Что то пошло не так...';
            }
            
            // console.log(result);
           }else{
            this.isOk = false;
            this.statusText = 'Произошла ошибка!';
            console.log(response)
        }
    },
    }
}
</script>
<style scoped>
.status{
  /* display: inline-block; */
  float: right;
}
</style>