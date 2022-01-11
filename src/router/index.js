import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)
const lazyLoad = (path) => {
  return () => import(/* webpackChunkName: "about" */`../views/${path}.vue`);
}

const routes = [
  {
    path: '/',
    component: lazyLoad('Main'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('users/fetchUser');
      await store.dispatch('login/fetchUser');
      next()
    },
    children: [
      {
        path: "/",
        name: 'Wellcome',
        component: lazyLoad('Wellcome')
      },
      {
        path: "/users",
        name: 'User',
        component: lazyLoad('User')
      },
      {
        path: '/doc_settings',
        name: 'DocSettings',
        component: lazyLoad('DocSettings')
      },
      {
        path: '/doc_send',
        name: 'DocSend',
        component: lazyLoad('DocSend')
      },
      {
        path: '/doc_received',
        name: 'DocReceived',
        component: lazyLoad('DocReceived')
      },
      {
        path: '/sended_document',
        name: 'DocSent',
        component: lazyLoad('DocSent')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('login-page/login-page')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const session = localStorage.getItem("access_token");
  const publicPages = ["/login"];
  const notPublicPages = !publicPages.includes(to.path);
  let logged = false;
  if (session) {
    logged = true;
  }
  if (logged && !notPublicPages) {
    next("/");
  } else if (!logged && notPublicPages) {
    next("/login");
  } else {
    next();
  }
});

export default router
