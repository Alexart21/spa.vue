<template>
    <form name="indexForm" id="index-form" @submit.prevent="sendForm" action="/" method="post">
    
    <!-- <input type="hidden" name="_csrf" :value="csrfToken"> -->
    
    <div class="field form-group">
      <label for="indexform-name">Имя</label>
      <input @focus="choiceField" type="text" name="IndexForm[name]" required tabindex="1">
    </div>

    <div class="field form-group">
      <label for="indexform-email">Email</label>
      <input @focus="choiceField" type="email" name="IndexForm[email]" required tabindex="2">
    </div>

    <div class="field form-group">
      <label class="control-label" for="indexform-tel">Тел.</label>
      <input v-phone placeholder="+7(___) ___-__-__" @focus="choiceField" type="text" name="IndexForm[tel]" required tabindex="3">
    </div>

    <div class="field form-group">
      <label for="indexform-text">Текст</label>
      <textarea @focus="choiceField" id="msg" class="form-control" name="IndexForm[text]" required tabindex="4"></textarea>
    </div>

    <input type="hidden" id="indexform-recaptcha" name="IndexForm[reCaptcha]">

    <div class="form-group">
      <button type="submit" class="btn success-button">Отправить</button>
      <h3 v-if="statusText" class="status" :class="[isOk ? 'text-success' : 'text-danger']">{{ statusText }}</h3>
    </div>
    
  </form>
</template>
<script>
function readCookie(name) {
  const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default {
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
    choiceField(event) {
      let el = event.target;
      let lbl = el.previousElementSibling;
      lbl.classList.add('fill');
    },
    hideStatus(){
        this.statusText = '';
    },
    clearForm(){
      document.forms.indexForm.reset();
      this.hideStatus();
    },
    async sendForm(){
      const form = document.forms.indexForm;
      
      await grecaptcha.ready(function () {
          // сам скрипт с google подключается в щаблоне views/layout/spa.php
          grecaptcha.execute('6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC', {action: 'index'}).then(function (token) {
              let inp = document.getElementById('indexform-recaptcha');
              inp.value = token;
              //
          });
      });
      
      let formData = new FormData(form);
      formData.append(readCookie('csrf_param'), readCookie('csrf_token'));
      this.isOk = true,
      this.statusText = 'Отправка...';
      const url = '/index';
         let response = await fetch(url, {
             method: 'POST',
             body: formData,
             headers: {
               // значение этого заголовка обычно ставится автоматически,
               // в зависимости от тела запроса
            },
         });
         let result = await response.json(); // с сервера json вида {status: true, msg:{}}
         result = JSON.parse(result);
         if(response.ok){
            if(result.status){
              this.statusText = this.statusText = 'Спасибо, данные приняты. Мы с Вами свяжемся';
              setTimeout(this.clearForm, 12000);
              // console.log(result)
            }else{
              this.isOk = false;
              this.statusText = 'Ошибка! Что то пошло не так...';
              console.log(result.msg)
            }
            
            // console.log(result);
           }else{
            this.isOk = false;
            this.statusText = 'Произошла ошибка!';
            console.log(response)
        }
    },
    },
    created() {
    
  },
}
</script>

<style scoped>
.status{
  /* display: inline-block; */
  float: right;
}
</style>