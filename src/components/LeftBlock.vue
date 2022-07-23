<template>
  <div id="left">
    <!-- начало "мобильное" левое меню -->
    <!--noindex-->
    <nav v-show="showMobMenu" ref="mobMenu" class="mob-menu-list">
      <strong class="mob-menu-header" title="создание сайтов">Создание сайтов</strong>
      <ul>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'sait_vizitka'}"  title="сайт визитка">сайт визитка
          </router-link>
        </li>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'korporativniy_sait'}"  title="корпоративный сайт">корпоративный сайт
          </router-link>
        </li>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'internet_magazin'}"  title="интернет магазин">интернет магазин
          </router-link>
        </li>
      </ul>
      <strong class="mob-menu-header" title="продвижение сайтов">Продвижение</strong>
      <ul>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'base_seo'}"  title="базовая seo оптимизация">базовая оптимизация
          </router-link>
        </li>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'key_seo'}"  title="продвижение по ключевым фразам">продвижение по фразам
          </router-link>
        </li>
        <li class="mob-link">
          <router-link @click="anchors" :to="{name: 'context'}"  title="контекстная реклама">контекстная реклама
          </router-link>
        </li>
      </ul><!--noindex--><strong class="mob-menu-header" title="другие услуги">другие услуги</strong>
      <!--/noindex-->
      <ul>
        <li class="mob-link"><a  title="парсинг сайтов" href="/parsing">парсинг сайтов</a>
        </li>
      </ul>
    </nav>
    <!--/noindex-->
    <!--noindex-->
    <div class="mob-menu-col">
      <div @click.stop="showMenu" ref="menuBtn" class="mob-menu-button" title="меню"></div>
    </div>
    <!--/noindex-->
    <!-- конец "мобильное" левое меню -->
    <!-- начало "десктопное" левое меню -->
    <nav id="l_menu">
      <router-link :to="{name: 'sozdanie'}" class="l_header link-anim" title="создание сайтов">Создание сайтов
      </router-link>
      <ul>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'sait_vizitka'}" title="сайт визитка">сайт визитка
          </router-link>
        </li>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'korporativniy_sait'}" title="корпоративный сайт">корпоративный сайт
          </router-link>
        </li>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'internet_magazin'}" title="интернет магазин">интернет магазин
          </router-link>
        </li>
      </ul>
      <br/>
      <router-link :to="{name: 'prodvijenie'}" class="l_header link-anim" title="продвижение сайтов">Продвижение сайтов
      </router-link>
      <ul>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'base_seo'}" title="базовая seo оптимизация">базовая оптимизация
          </router-link>
        </li>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'key_seo'}" title="продвижение по ключевым фразам">продвижение по фразам
          </router-link>
        </li>
        <li class="left_gr2">
          <router-link @click="anchors" :to="{name: 'context'}" title="контекстная реклама">контекстная реклама
          </router-link>
        </li>
      </ul>
      <br/><!--noindex--><strong class="l_header">Другие услуги</strong><!--/noindex-->
      <br/>
      <ul>
        <li class="left_gr2">
          <router-link @click="goTop" :to="{name: 'parsing'}" title="парсинг сайтов">парсинг сайтов
          </router-link>
        </li>
      </ul>
    </nav>
    <!-- конец "десктопное" левое меню -->
  </div>
</template>
<script>
export default {
  emits: ['mobMenuEmit'],
  data() {
    return {
      showMobMenu: false,
    }
  },
  methods: {
    anchors() {
      this.$router.afterEach((to, from) => {
       let h = location.hash;
        let anchor = h.slice(1); // хеш без символа #
        let el = document.getElementById(anchor);
        let top = el.offsetTop + el.offsetParent.offsetTop;
        window.scrollTo(0, top);
    })
    },
    showMenu() {
      // console.log(this.$refs.mobMenu);
      const mobMenu = this.$refs.mobMenu;
      const menuBtn = this.$refs.menuBtn;
      this.showMobMenu = true;
      mobMenu.classList.toggle('menu-animate');
      menuBtn.classList.toggle('btn-pos');
      this.$emit('mobMenuEmit');
    },
    goTop() {
      window.scrollTo(0, 0);
    },
  }
}
</script>