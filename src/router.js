import {createRouter, createWebHistory} from 'vue-router'

import Index from '@/components/pages/Index';
import Sozdanie from '@/components/pages/Sozdanie';
import Prodvijenie from '@/components/pages/Prodvijenie';
import Portfolio from '@/components/pages/Portfolio';
import Contacts from '@/components/pages/Contacts';
import Parsing from '@/components/pages/Parsing';
import AppE404 from '@/components/pages/E404';

const routes = [
  {
    name: 'index',
    path: '/',
    component: Index
  },
  {
    name: 'sozdanie',
    path: '/sozdanie',
    component: Sozdanie
  },
  {
    name: 'prodvijenie',
    path: '/prodvijenie',
    component: Prodvijenie
  },
  {
    name: 'portfolio',
    path: '/portfolio',
    component: Portfolio
  },
  {
    name: 'contacts',
    path: '/contacts',
    component: Contacts
  },
  {
    name: 'parsing',
    path: '/parsing',
    component: Parsing
  },
  {
    name: 'sait_vizitka',
    path: '/sozdanie#sait_vizitka',
    component: Sozdanie
  },
  {
    name: 'korporativniy_sait',
    path: '/sozdanie#korporativniy_sait',
    component: Sozdanie
  },
  {
    name: 'internet_magazin',
    path: '/sozdanie#internet_magazin',
    component: Sozdanie
  },
  {
    name: 'base_seo',
    path: '/prodvijenie#base_seo',
    component: Prodvijenie
  },
  {
    name: 'key_seo',
    path: '/prodvijenie#key_seo',
    component: Prodvijenie
  },
  {
    name: 'context',
    path: '/prodvijenie#context',
    component: Prodvijenie
  },
  {
    path: '/:any(.*)', // .*
    component: AppE404
  }
];

export default createRouter({
  routes,
  history: createWebHistory(),
  // для перехода по анкорным ссылкам
  /*scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
        // , offset: { x: 0, y: 10 }
      }
    }
  }*/
});
