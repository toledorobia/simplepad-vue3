import { createStore } from 'vuex'

import auth from "./auth";
import notepads from "./notepads";

export default createStore({
  // state: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  modules: {
    auth,
    notepads,
  }
})
