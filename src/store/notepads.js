import firebase from "firebase/app";
import { db } from "../firebase";

export default {
  // namespaced: true,
  state: () => ({
    notepads: false,
  }),
  getters: {
    notepads: state => {
      return state.notepads;
    },
  },
  mutations: {
    setNotepads(state, payload) {
      state.notepads = payload;
    },
  },
  actions: {
  },
  modules: {
  }
};
