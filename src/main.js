import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "bootstrap/dist/js/bootstrap.bundle.min";
import "./main.scss";

import { auth } from './firebase';
import { firebaseClearUser } from "@toledorobia/helpers";

let app = null;
auth.onAuthStateChanged((user) => {
  store.dispatch("setAuth", firebaseClearUser(user));

  if (app == null) {
    app = createApp(App)
      .use(store)
      .use(router)
      .mount('#app')
  }
});


