// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import NProgress from 'nprogress'
import Cookies from 'js-cookie'
import 'iview/dist/styles/iview.css';

Vue.use(iView);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  NProgress.start();
  
  if (Cookies.get('username')) {
    next();
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({path: '/login'});
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

function logout() {
  store.dispatch('logout').then(function () {
    router.push({path: '/login'})
  }).catch(function () {
    router.push({path: '/login'})
  })
}

//设置半小时无操作就退出登录
const timeout = 1000 * 60 * 30;
let timeoutTimer = setTimeout(logout, timeout);
window.onload = function () {
  document.body.addEventListener('click', function () {
    clearTimeout(logout, timeout);
    
    if (store.state.username) {
      timeoutTimer = setTimeout(logout, timeout);
    }
  })
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
