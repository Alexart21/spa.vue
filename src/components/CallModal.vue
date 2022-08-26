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
            @click="this.$store.commit('hideCallModal')"
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
                v-model.lazy="name"
                @focus="v$.$reset()"
                @blur="v$.name.$touch()"
                type="text"
                class="form-control"
                name="callForm[name]"
                placeholder="Ваше имя"
              />
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
              <label class="control-label" for="callform-tel"
                >Номер телефона</label
              >
              <input
                v-model.lazy="tel"
                @focus="v$.$reset()"
                @blur="v$.tel.$touch()"
                v-phone
                placeholder="+7(___) ___-__-__"
                type="text"
                class="form-control"
                name="callForm[tel]"
              />
              <p
                v-for="error of v$.$errors"
                :key="error.$uid"
                class="text-danger"
              >
                <span v-if="error.$property === 'tel'">
                  Номер телефона обязателен
                </span>
              </p>
            </div>

            <input
              id="callform-recaptcha"
              type="hidden"
              name="callForm[reCaptcha]"
            />

            <div class="form-group">
              <button type="submit" class="btn success-button button-anim">
                жду звонка!
              </button>
              <h3
                v-if="statusText"
                class="status"
                :class="[isOk ? 'text-success' : 'text-danger']"
              >
                {{ statusText }}
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
function readCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
//
import { mapGetters } from "vuex";
//
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
  computed: mapGetters(["modal"]),
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
      errArr: [],
      isOk: true,
      // csrfToken: readCookie('csrf_token'),
    };
  },
  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(30),
        alpha: (val) => /^[а-яё]*$/i.test(val),
      },
      tel: {
        required,
      },
    };
  },
  methods: {
    hideStatus() {
      this.statusText = "";
    },
    clearForm() {
      document.forms.callForm.reset();
      this.hideStatus();
    },
    async sendForm() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        alert("Заполните форму корректными данными!");
        // this.v$.$reset();
        return;
      }
      let form = document.forms.callForm;
      //
      await grecaptcha.ready(function () {
        // сам скрипт с google подключается в щаблоне views/layout/spa.php
        grecaptcha
          .execute("6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC", {
            action: "call",
          })
          .then(function (token) {
            let inp = document.getElementById("callform-recaptcha");
            inp.value = token;
          });
      });
      //
      let formData = new FormData(form);
      formData.append(readCookie("csrf_param"), readCookie("csrf_token"));
      (this.isOk = true), (this.statusText = "Отправка...");
      this.errArr = [];
      const url = "/call";
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
          this.statusText = this.statusText =
            "Спасибо, данные приняты. Мы с Вами свяжемся";
          setTimeout(this.clearForm, 12000);
          // console.log(result)
        } else {
          this.isOk = false;
          let txt = "";
          this.statusText = "Ошибка! Что то пошло не так...";
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
  },
};
</script>
<style scoped>
.status {
  /* display: inline-block; */
  float: right;
}
</style>
