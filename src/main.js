import Vue from 'vue';
import Moment from 'moment';
import lodash from 'lodash';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import CtmsComponents from '@/components/3.4.2';

// 自定义主题
import '@/customTheme/dist/iview.css';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './permission';

// 验证规则可在 rules.js文件添加
import rules from '@/utils/rules';
import '@/utils/directives';

Vue.config.productionTip = false;
Vue.prototype.$rules = rules;
Vue.prototype._ = lodash;
Vue.prototype.$Moment = Moment;
Vue.prototype.$baseUrl = process.env.VUE_APP_REQUEST_BASE_URL;
Vue.use(ViewUI);
Vue.use(CtmsComponents);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
