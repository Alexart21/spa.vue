import {createRouter, createWebHistory} from 'vue-router'

import Index from '@/components/pages/Index';
import Sozdanie from '@/components/pages/Sozdanie';
import Prodvijenie from '@/components/pages/Prodvijenie';
import Portfolio from '@/components/pages/Portfolio';
import Parsing from '@/components/pages/Parsing';
import Location from '@/components/pages/Location';
import Address from '@/components/pages/Address';
import Scroll from '@/components/pages/Scroll';
import AppE404 from '@/components/pages/E404';
import Test from '@/components/pages/Test';
import Dragdrop from '@/components/pages/Dragdrop';
import Photo from '@/components/pages/Photo';
import Cropper from '@/components/pages/Cropper';
import Chat from '@/components/pages/Chat';
import Video from '@/components/pages/Video';

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
    path: '/#contacts',
    component: Index
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
    name: 'response',
    path: '/sozdanie#response',
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
    name: 'location',
    path: '/location',
    component: Location
  },
  {
    name: 'address',
    path: '/address',
    component: Address
  },
  {
    name: 'scroll',
    path: '/scroll',
    component: Scroll
  },
  {
    name: 'test',
    path: '/test',
    component: Test
  },
  {
    name: 'dragdrop',
    path: '/dragdrop',
    component: Dragdrop
  },
  {
    name: 'photo',
    path: '/photo',
    component: Photo
  },
  {
    name: 'cropper',
    path: '/cropper',
    component:Cropper 
  },
  {
    name: 'chat',
    path: '/chat',
    component:Chat 
  },
  {
    name: 'video',
    path: '/video',
    component:Video 
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
