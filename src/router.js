import Vue from 'vue';
import Router from 'vue-router';
import {
  baseRouters,
  whiteRouters,
} from '@/config/router.config';

Vue.use(Router);

export default new Router({
  routes: [
    ...whiteRouters,
    ...baseRouters,
  ],
});
