<template>
    <form id="index-form" @submit.prevent="sendForm" action="/" method="post">
    
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
      <input @focus="choiceField" type="text" name="IndexForm[tel]" required tabindex="3">
    </div>

    <div class="field form-group">
      <label for="indexform-text">Текст</label>
      <textarea @focus="choiceField" id="msg" class="form-control" name="IndexForm[text]" required tabindex="4"></textarea>
    </div>

    <!-- <input type="hidden" id="indexform-recaptcha" name="IndexForm[reCaptcha]"> -->

    <div class="form-group">
      <button type="submit" class="btn success-button">Отправить</button>
      <h2 v-if="statusText" class="status" :class="[isOk ? 'text-success' : 'text-danger']">{{ statusText }}</h2>
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
    async sendForm(){
      let formData = new FormData(document.forms[0]);
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
         let result = await response.text(); // приходит 0 или 1(true/false)
         if(response.ok){
            if(result){
              this.statusText = 'Спасибо,' + formData.get('IndexForm[name]') + ' форма отправлена. Мы с Вами свяжемся';
              setTimeout(this.hideStatus, 15000)
            }else{
              this.isOk = false;
              this.statusText = 'Что то пошло не так.Повторите попытку.';
            }
            
            // console.log(result);
           }else{
            this.isOk = false;
            this.statusText = 'Произошла ошибка';
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