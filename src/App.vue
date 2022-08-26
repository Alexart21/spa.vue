<template>
  <!-- Modal -->
  <call-modal />
  <!-- end Modal -->
  <div
    id="container"
    @scroll="pageScroll"
    @click="containerClick"
    ref="container"
  >
    <!--Flash-->
    <!--end Flash-->
    <div id="main">
      <div id="all">
        <header-block :shtorkaAnimate="shtorkaAnimate" />
        <top-menu :menuFixed="menuFixed" />
        <div id="block">
          <!-- начало левый блок -->
          <left-block @mobMenuEmit="mobMenu" />
          <!-- конец левый блок -->
          <!-- начало основной контент -->
          <div class="inc-out">
            <main id="inc">
              <router-view />
            </main>
            <div id="inc-overlay"></div>
          </div>
          <!-- конец основной контент -->
        </div>
        <!--кнопка вверх-->
        <scroll-top-btn :showGoTop="showGoTop" />
        <!--/-->
        <msg-block :right="msgRightMargin" />
        <!--/-->
      </div>
    </div>
    <!--noindex-->
    <div style="width: 100%; height: 10px"></div>
    <footer-block />
    <!--/noindex-->
  </div>
</template>
<script>
const screen_w = document.body.clientWidth;
const screen_h = document.body.clientHeight;

import TopMenu from "@/components/TopMenu";
import HeaderBlock from "@/components/HeaderBlock";
import FooterBlock from "@/components/FooterBlock";
import MsgBlock from "@/components/MsgBlock";
import LeftBlock from "@/components/LeftBlock";
import ScrollTopBtn from "@/components/ui/ScrollTopBtn";
import CallModal from "@/components/CallModal";

// import { mapGetters } from 'vuex';

export default {
  // computed: mapGetters(['modal']),
  components: {
    TopMenu,
    FooterBlock,
    MsgBlock,
    LeftBlock,
    HeaderBlock,
    ScrollTopBtn,
    CallModal,
  },
  data() {
    return {
      shtorkaAnimate: false,
      msgRightMargin: 0,
      showMobMenu: false,
      showGoTop: false,
      menuFixed: false,
    };
  },
  methods: {
    handleScroll() {
      let top = window.pageYOffset; // сколько проскролено
      if (top > 500) {
        this.showGoTop = true;
        this.menuFixed = true;
      } else {
        this.showGoTop = false;
        this.menuFixed = false;
      }
    },
    mobMenu() {
      this.showMobMenu = true;
    },
    initMsgBlock() {
      let all = this.$refs.container.clientWidth;
      this.msgRightMargin = (screen_w - all) / 2;
    },
    containerClick(e) {
      // закрытие мобильного меню при клике в пределах контейнера
      if (this.showMobMenu) {
        let target = e.target;
        const Btn = document.querySelector(".mob-menu-button"),
          menu = document.querySelector(".mob-menu-list");
        if (menu.classList.contains("menu-animate")) {
          // menu.classList.remove('menu-animate');
          menu.classList.toggle("menu-animate");
          Btn.classList.toggle("btn-pos");
        }
      }
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.initMsgBlock();
    this.shtorkaAnimate = true;
  },
};
</script>
