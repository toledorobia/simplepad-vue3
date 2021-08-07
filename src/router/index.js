import { createRouter, createWebHistory } from 'vue-router'
import store from "../store/index";
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      auth: true,
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  let auth = to.matched.some(record => record.meta.auth);

  if (auth && !store.getters.isLogged) {
    next({
      path: '/sign-in',
      query: { redirect: to.fullPath }
    })
  }
  else if (!auth && store.getters.isLogged) {
    next({ path: "/home" })
  }
  else {
    next()
  }
});

export default router
