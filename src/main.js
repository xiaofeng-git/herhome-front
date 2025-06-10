import { VueElement, createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import { ElMessageBox } from 'element-plus'
// 添加全局样式
import './assets/css/global.css'
//引入iconfont
import './assets/font/iconfont.css'
// 引入echat
import echarts from 'echarts'
// 引入axios
import axios from 'axios'
// 导入 vue-axios 插件
import VueAxios from 'vue-axios'
// 挂载让全局可以使用
const app = createApp(App)
// 在创建 vue 实例之前，使用 vue-axios 插件
app.use(VueAxios, axios);
// 错误的写法
//Vue.prototype.$http = axios
// 设置echat
//app.config.globalProperties.$echarts = echarts
// 设置访问根路径
axios.defaults.baseURL="http://9.119.100.85:9000"
axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
// 设置echat
app.config.globalProperties.$echarts = echarts
// 请求拦截器
axios.interceptors.request.use (
    config => {
      // 获取 token
      const token = window.btoa(window.sessionStorage.getItem('user'));
      // 如果 token 存在，将 token 添加到请求头中
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      // 返回修改后的配置
      return config;
    },
    error => {
      // 如果出错，返回 Promise 的 reject 状态
      return Promise.reject (error);
    }
  );
  // 添加请求拦截器
axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
        const {status, data} = error.response;
        
        ElMessageBox.alert(data.message);
        return error.response;
    }
  );
  app.config.globalProperties.$http = axios
installElementPlus(app)
app.use(router).use(ElMessageBox).mount('#app')