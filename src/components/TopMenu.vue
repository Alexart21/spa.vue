<template>
  <div id="menu_outer" :class="{menu_outer_fixed: menuFixed}">
    <div id="top_menu">
      <div class="menu_shadow main-menu">
        <nav :class="{resp_fixed: menuFixed}" class="resp">
          <ul :class="{scrolled: menuFixed}" class="menutop  highlightTextIn">
            <li>
              <router-link :class="{link_fixed: menuFixed}" :to="{name: 'index'}" @click="goTop" class="portf-call"
                           data-m="главная" title="">главная
              </router-link>
            </li>
            <li>
              <router-link :class="{link_fixed: menuFixed}" :to="{name: 'sozdanie'}" @click="goTop"
                           exact-active-class="header_shadow cursor-default" class="portf-call" data-m="создание сайтов"
                           title="создание сайтов">создание сайтов
              </router-link>
            </li>
            <li>
              <router-link :class="{link_fixed: menuFixed}" :to="{name: 'prodvijenie'}" @click="goTop"
                           exact-active-class="header_shadow cursor-default" class="portf-call" data-m="продвижение"
                           title="продвижение сайтов">продвижение
              </router-link>
            </li>
            <li>
              <router-link :class="{link_fixed: menuFixed}" :to="{name: 'portfolio'}" @click="goTop"
                           exact-active-class="header_shadow cursor-default" class="portf-call" data-m="портфолио"
                           title="">портфолио
              </router-link>
            </li>
            <li>
              <router-link :class="{link_fixed: menuFixed}" :to="{name: 'contacts'}" @click="anchors"
                           exact-active-class="header_shadow cursor-default" data-m="контакты" title="">контакты
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    menuFixed: {
      type: Boolean,
      default: false,
    },
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
    goTop() {
      window.scrollTo(0, 0);
    },
  },
}
</script>