<style scoped>
.modal {
  display: block;
  background: rgba(0, 0, 0, 0.2);
}
</style>
<template>
  <div v-show="modal" class="modal" id="callback">
    <div class="modal-dialog">
      <div class="modal-content animate__animated animate__bounceInDown">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Обратный звонок</h4>
          <button
            @click="hideCallModal"
            type="button"
            class="close"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form
            name="callForm"
            @submit.prevent="sendForm"
            action="/call"
            method="post"
          >
            <div class="form-group">
              <input
                v-model.lazy.trim="name"
                @focus="v$.$reset()"
                @blur="v$.name.$touch()"
                type="text"
                class="form-control"
                name="name"
                placeholder="Ваше имя"
              />
              <div v-if="v$.name.$errors.length" class="errLabel"><mdicon name="exclamation-thick" /></div>
              <p
                v-for="error of v$.$errors"
                :key="error.$uid"
                class="text-danger"
              >
                <span v-if="error.$property === 'name'">
                  <span v-if="error.$validator === 'minLength'">
                    Длина имени не менее
                    {{ v$.name.minLength.$params.min }} символов
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

            <div class="form-group">
              <label class="control-label" for="tel"
                >Номер телефона</label
              >
              <input
                v-model.lazy.trim="tel"
                @focus="v$.$reset()"
                @blur="v$.tel.$touch()"
                v-phone
                placeholder="+7(___) ___-__-__"
                type="text"
                class="form-control"
                name="tel"
              />
              <p
                v-for="error of v$.$errors"
                :key="error.$uid"
                class="text-danger"
              >
                <span v-if="error.$property === 'tel'">
                  <span v-if="error.$validator === 'required'">
                  Номер телефона обязателен
                </span>
                </span>
              </p>
            </div>
            <input
              id="callform-recaptcha"
              type="hidden"
              name="reCaptcha"
            />

            <div class="form-group">
              <button type="submit" class="btn success-button button-anim" :disabled="btnDisabled">
                жду звонка!
              </button>
              <h3
                v-if="statusText"
                class="status"
                :class="[isOk ? 'text-success' : 'text-danger']"
              >
              <span v-show="loader"><loader /></span>{{ statusText }}
              </h3>
            </div>
            <div v-show="errArr.length">
              <h4
                class="text-danger"
                v-for="(item, index) in errArr"
                :key="index"
              >
                {{ item }}
              </h4>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import Loader from "./ui/Loader.vue";
import {
  required,
  email,
  minLength,
  maxLength,
  alfa,
} from "@vuelidate/validators";
//
export default {
  components: {
    Loader
  },
  computed: mapGetters(["modal", "csrf"]),
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
      tel: "",
      statusText: "",
      loader: false,
      errArr: [],
      isOk: true,
      btnDisabled: false,
      // csrfToken: readCookie('csrf_token'),
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
      tel: {
        required,
      },
    };
  },
  methods: {
    ...mapMutations(['hideCallModal']),
    hideStatus() {
      this.statusText = "";
    },
    clearForm() {
        this.hideStatus();
        this.name = '';
        this.tel = '';
        this.v$.$reset(); // иначе выбрасывает валидацию что поля пустые
    },
    async fetchData() {
      let form = document.forms.callForm;
      let formData = new FormData(form);
      formData.append('_token', this.csrf);
      this.errArr = [];
      const url = "/zvonok";
      let response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          // значение этого заголовка обычно ставится автоматически,
          // в зависимости от тела запроса
        },
      });
      let result = await response.json(); // с сервера json вида {status: true, msg:{}}
      if (response.ok) {
        this.loader = false;
        this.btnDisabled = false;
        if (result.success) {
          this.statusText = "Спасибо, данные приняты. Мы с Вами свяжемся";
          setTimeout(this.clearForm, 4000);
        } else {
          this.isOk = false;
          this.statusText = "Ошибка! Что то пошло не так...";
          console.log(response);
          console.log(result);
          for (let [key, value] of Object.entries(result.errors)) {
            this.errArr.push(value);
          }
        }
      } else {
        this.loader = false;
        this.statusText = "Произошла ошибка!";
        this.btnDisabled = false;
        this.isOk = false;
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
      this.loader = true;
      this.statusText = "Отправка...";
      this.btnDisabled = true;
      try {
        await grecaptcha.ready(() => {
          // сам скрипт с google подключается в щаблоне views/layout/spa.php
          grecaptcha
            .execute("6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC", {
              action: "call",
            })
            .then((token) => {
              let inp = document.getElementById("callform-recaptcha");
              inp.value = token;
              this.fetchData();
            });
        });
      } catch (error) {
        this.loader = false;
        this.isOk = false;
        this.statusText = "Ошибка ReCaptcha! Попробуйте повторить попытку.";
        this.btnDisabled = false;
        console.log(error);
        // setTimeout(this.clearForm, 4000);
        setTimeout(this.hideStatus, 4000);
      }
    },
  },
};
</script>
<style scoped>
.status {
  /* display: inline-block; */
  float: right;
}
</style>
