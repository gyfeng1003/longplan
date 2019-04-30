import Vue from 'vue';
import store from './store';
import fetch from './utils/fetch';
import '../lib/range-slider';
import Toast from './components/child/toast';
import Loading from './components/child/loading';
import App from './App';
import router from './router';
import VueI18n from 'vue-i18n';
import VueScroller from './components/child/vueScroller';
import VueKeyboard from  './components/child/vueKeyboard';
import VCharts from 'v-charts';
// import './config/rem';

Vue.use(VCharts)

Vue.use(VueScroller)
Vue.use(VueKeyboard)
Vue.use(VueI18n)

// 引入 ECharts 主模块
// import echarts from 'echarts/lib/echarts';
// // 引入柱状图
// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/tooltip';
// Vue.prototype.$echarts = echarts;
Vue.prototype.$http = fetch;
Vue.use(Toast);
Vue.use(Loading);
Vue.config.productionTip = false;

import TableColumn from './components/table/src/table-column';
Vue.component('el-table-column', TableColumn);

const i18n = new VueI18n({
	locale: 'en',  // 语言标识
	messages: {
		'zh': require('./I18n/lang/zh'),
		'en': require('./I18n/lang/en')
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
	i18n,
  components: { App },
  template: '<App/>'
})
