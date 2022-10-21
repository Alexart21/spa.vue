<template>
  <form
    name="indexForm"
    id="index-form"
    @submit.prevent="sendForm"
    action="/"
    method="post"
  >
    <!-- <input type="hidden" name="_csrf" :value="csrfToken"> -->

    <div class="field form-group">
      <label for="indexform-name">Имя</label>
      <input
        @click="choiceField"
        type="text"
        v-model.lazy.trim="name"
        @focus="v$.$reset()"
        @blur="v$.name.$touch()"
        name="IndexForm[name]"
        tabindex="1"
      />

      <p v-for="error of v$.$errors" :key="error.$uid" class="text-danger">
        <span v-if="error.$property === 'name'">
          <span v-if="error.$validator === 'minLength'">
            Длина имени не менее {{ v$.name.minLength.$params.min }} символов
          </span>
          <span v-else-if="error.$validator === 'maxLength'">
            Длина имени не должна превышать
            {{ v$.name.maxLength.$params.max }} символов
          </span>
          <span v-else-if="error.$validator === 'required'">
            Поле имя обязательно к заполнению
          </span>
          <span v-else> Пожалуйста, пишите кириллицей </span>
        </span>
      </p>
    </div>

    <div class="field form-group">
      <label for="indexform-email">Email</label>
      <input
        @click="choiceField"
        type="text"
        name="IndexForm[email]"
        v-model.lazy.trim="email"
        @focus="v$.$reset()"
        @blur="v$.email.$touch()"
        tabindex="2"
      />
      <p v-for="error of v$.$errors" :key="error.$uid" class="text-danger">
        <span v-if="error.$property === 'email'">
          <span v-if="error.$validator === 'email'">
            Введите корректный email
          </span>
          <span v-else> Поле email обязательно к заполнению </span>
        </span>
      </p>
    </div>

    <div class="field form-group">
      <label class="control-label" for="indexform-tel">Тел.</label>
      <input
        v-phone
        placeholder="+7(___) ___-__-__"
        v-model.lazy.trim="tel"
        @focus="choiceField"
        type="text"
        name="IndexForm[tel]"
        tabindex="3"
      />
    </div>

    <div class="field form-group">
      <label for="indexform-text">Текст</label>
      <textarea
        @click="choiceField"
        v-model.lazy.trim="text"
        @focus="v$.$reset()"
        @blur="v$.text.$touch()"
        id="msg"
        class="form-control"
        name="IndexForm[text]"
        tabindex="4"
      ></textarea>

      <p v-for="error of v$.$errors" :key="error.$uid" class="text-danger">
        <span v-if="error.$property === 'text'">
          <span v-if="error.$validator === 'minLength'">
            Введите хотя бы {{ v$.text.minLength.$params.min }} символа
          </span>
          <span v-else-if="error.$validator === 'maxLength'">
            Длина текста не должна превышать
            {{ v$.text.maxLength.$params.max }} символов
          </span>
          <span v-else> Поле текст обязательно к заполнению </span>
        </span>
      </p>
    </div>

    <input type="hidden" id="indexform-recaptcha" name="IndexForm[reCaptcha]" />

    <div class="form-group">
      <button type="submit" class="btn success-button">Отправить</button>
      <h3
        v-if="statusText"
        class="status"
        :class="[isOk ? 'text-success' : 'text-danger']"
      >
        {{ statusText }}
      </h3>
      <div v-show="errArr.length">
        <h4 class="text-danger" v-for="(item, index) in errArr" :key="index">
          {{ item }}
        </h4>
      </div>
    </div>
  </form>
</template>
<script>
import useValidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  alfa,
} from "@vuelidate/validators";
//
export default {
  directives: {
    // маска ввода +7 (999) 999-99-99
    phone: {
      mounted(el) {
        el.oninput = function (e) {
          if (!e.isTrusted) {
            return;
          }
          const x = this.value
            .replace(/\D/g, "")
            .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
          x[1] = "+7";
          this.value = !x[3]
            ? x[1] + " (" + x[2]
            : x[1] +
              " (" +
              x[2] +
              ") " +
              x[3] +
              (x[4] ? "-" + x[4] : "") +
              (x[5] ? "-" + x[5] : "");
        };
      },
    },
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      tel: "",
      text: "",
      statusText: "",
      errArr: [],
      isOk: true,
    };
  },
  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(30),
        alpha: (val) => /^[А-Яа-яё -][А-Яа-яё -][А-Яа-яё -]*$/i.test(val),
      },
      email: {
        required,
        email,
      },
      text: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(2000),
      },
    };
  },
  methods: {
    choiceField(event) {
      let el = event.target;
      let lbl = el.previousElementSibling;
      lbl.classList.add("fill");
    },
    hideStatus() {
      this.statusText = "";
    },
    clearForm() {
      this.hideStatus();
      this.name = '';
      this.email = '';
      this.tel = '';
      this.text = '';
      this.v$.$reset(); // иначе выбрасывает валидацию что поля пустые
    },
    async fetchData() {
      const form = document.forms.indexForm;
      let formData = new FormData(form);
      // куки установлены в шаблоне views/layout/spa.php
      formData.append(readCookie("csrf_param"), readCookie("csrf_token"));
      this.errArr = [];
      const url = "/form";
      let response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          // значение этого заголовка обычно ставится автоматически,
          // в зависимости от тела запроса
        },
      });
      let result = await response.json(); // с сервера json вида {status: true, msg:{}}
      result = JSON.parse(result);
      if (response.ok) {
        if (result.status) {
          this.statusText = "Спасибо, данные приняты. Мы с Вами свяжемся";
          setTimeout(this.clearForm, 4000);
          // setTimeout(this.hideStatus, 4000);
          // console.log(result)
        } else {
          this.isOk = false;
          let txt = "";
          this.statusText = "Ошибка! Что то пошло не так...";
          // let {msg} = result.msg; //
          // console.log(result.msg)
          for (let [key, value] of Object.entries(result.msg)) {
            this.errArr.push(value);
          }
        }
      } else {
        this.isOk = false;
        this.statusText = "Произошла ошибка!";
        console.log(response);
      }
    },
    async sendForm() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        // this.v$.$reset();
        return;
      }
      this.isOk = true;
      this.statusText = "Отправка...";
      // привязываем контекст
      let that = this;
      try {
        grecaptcha.ready(function () {
          // сам скрипт с google подключается в щаблоне views/layout/spa.php
          grecaptcha
            .execute("6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC", {
              action: "index",
            })
            .then(function (token) {
              let inp = document.getElementById("indexform-recaptcha");
              inp.value = token;
              that.fetchData();
            });
        });
      } catch (error) {
        this.isOk = false;
        this.statusText = "Ошибка ReCaptcha! Попробуйте повторить попытку.";
        console.log(error);
        // setTimeout(this.clearForm, 4000);
        setTimeout(this.hideStatus, 4000);
      }
    },
  },
  created() {},
  mounted() {
    // console.log(this.v$);
  },
};
</script>

<style scoped>
.status {
  /* display: inline-block; */
  float: right;
}
</style>
