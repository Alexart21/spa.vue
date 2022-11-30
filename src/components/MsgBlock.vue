<template>
  <audio preload="auto">
    <source src="./../assets/audio/buben.mp3" type="audio/mpeg">
    <!-- <source src="./assets/audio/buben.ogg" type="audio/ogg"> -->
  </audio>
  <!--Окно чата-->
  <div v-show="showMsg" @click="openMsgBlock" @mouseover="hideTooltip" :class="msgBlockClasses"
       :style="{right: marginRight}" id="msg-block">
    <div v-show="showTooltip" @mouseover="hideTooltip" class="msg-tooltip">Здравствуйте, я Александр. Чем могу помочь?
    </div>
    <button @click.stop="closeMsgBlock" type="button" class="close"><span>×</span></button>
    <div id="msg-content">
      <div v-show="!msgOpened" class="msg-closed">
        <div class="msg-icons-block">
        <span class="viber-icon viber d-block icon-item"></span>
        <span class="wats-icon wats d-block icon-item"></span>
        <span class="tg-icon tg d-block icon-item"></span>
        </div>
        <b class="msg-closed-text">Начните чат</b>
      </div>
      <img class="msg-img rounded-circle img-thumbnail" :class="{imgOpened: msgOpened}" src="./../assets/img/msg.png"
           alt="">
      <div class="msg-text">
        <div class="text-center text-info">{{ hello }}, я Александр.</div>
        <div class="text-center text-info">выберите мессенджер и начните чат</div>
        <i style="display:block;text-align: right"><mdicon name="check-all" class="text-success" />{{ getTime }}&nbsp;&nbsp;</i>
      </div>
      <hr>
      <a class="msg-btn viber-bg" href="viber://chat?number=79876680484"
         target="_blank"><div class="viber-icon icon-large"></div> Viber</a>
      <a class="msg-btn watsap-bg" href="whatsapp://send?phone=79876680484"
         target="_blank"><div class="wats-icon icon-large"></div> Watsapp</a>
      <a class="msg-btn tg-bg" href="https://telegram.me/Mihalych211" target="_blank"><div class="tg-icon icon-large"></div> Telegram</a>
    </div>
  </div>
</template>
<script>
const screen_w = document.body.clientWidth;
const screen_h = document.body.clientHeight;

function readCookie(name) {
  const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default {
  props: {
    right: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      showMsg: false,
      msgOpened: false,
      openMsg: false,
      showTooltip: false,
      // openedClasses: 'msgOpened',
    }
  },
  methods: {
    displayMsgBlock() {
      setTimeout(() => {
        this.showMsg = true;
      }, 3000);

    },
    openMsgBlock() {
      this.msgOpened = true;
      this.showTooltip = false;
    },
    closeMsgBlock() {
      this.msgOpened = false;
    },
    displayTooltip() {
      setTimeout(() => {
        this.showTooltip = true;
        //
        let promise = document.querySelector('audio').play();
        if (promise !== undefined) {
          promise.then(_ => {
            console.log('play!');
          }).catch(err => {
            console.log(err.message);
          });
        }
        //
      }, 6000);
    },
    hideTooltip() {
      this.showTooltip = false;
    },
    dropTooltip() {
      setTimeout(() => {
        this.showTooltip = false;
      }, 12000);
    },
  },
  computed: {
    msgBlockClasses(){
      return this.msgOpened ? 'msgOpened animate__animated animate__bounceInUp' : '';
    },
    getTime() {
      let dt = new Date();
      // время без секунд вида 07:48
      let currentTime = dt.toLocaleTimeString().slice(0, -3);
      return currentTime;
    },
    hello(){
      let hour = new Date().toLocaleTimeString().slice(0, -6);
      let txt;
      if(hour >= 21){
        txt = 'Доброй ночи';
      }else if(hour >= 6 && hour <= 10){
        txt = 'Доброе утро';
      }else if(hour > 10 && hour <= 18){
        txt = 'Добрый день'
      }else if(hour > 18 && hour < 21){
        txt = 'Добрый вечер';
      }else{
        txt = 'Доброго времени суток';
      }
      return txt;
    },
    marginRight() {
      return this.right + 'px';
    },
  },
  mounted() {
    this.displayMsgBlock(); //  показываем блок с чатом
    this.displayTooltip();
    this.dropTooltip(); // скрываем подсказку
  },
}
</script>