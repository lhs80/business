import "element-ui/lib/theme-chalk/index.css";
import "vue-area-linkage/dist/index.css";
import "./styles/common.scss";

import Vue from "vue";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import VueMoment from "vue-moment";
import App from "./App";

import "babel-polyfill";
import axios from "./api/axios";
import "./permission"; // 权限
import router from "./router/router";
import store from "./store";
import AVUE from "avue-cli/lib/avue.js";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VideoPlayer from "vue-video-player";
import echarts from 'echarts'
import qs from "qs";

Vue.prototype.$echarts = echarts

//引用城市三级联动
import VueAreaLinkage from "vue-area-linkage";
//统一引用urlCol
import urlCol from "@/common/urlCol";
import {loadStyle} from "./utils/util";
//富文本控件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//滚动条样式
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.use(GeminiScrollbar)

//代码复制
import VueClipboards from 'vue-clipboards';

Vue.use(VueClipboards);

Vue.config.productionTip = false;
Vue.use(VueAreaLinkage);
Vue.use(VideoPlayer);
Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);
Vue.use(VueMoment);
Vue.use(VueAxios, axios);
Vue.use(VueQuillEditor)


const app = new Vue({
  router,
  store,
  render: h => h(App)
});

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount("#app");
});
